package com.bazarPepe.eccomerce.service.implementation;

import com.bazarPepe.eccomerce.dto.LoginRequest;
import com.bazarPepe.eccomerce.dto.Response;
import com.bazarPepe.eccomerce.dto.UserDto;
import com.bazarPepe.eccomerce.entity.User;
import com.bazarPepe.eccomerce.enums.UserRole;
import com.bazarPepe.eccomerce.exception.InvalidCredentialsException;
import com.bazarPepe.eccomerce.exception.NotFoundException;
import com.bazarPepe.eccomerce.mapper.EntityDtoMapper;
import com.bazarPepe.eccomerce.repository.UserRepository;
import com.bazarPepe.eccomerce.security.JwtUtils;
import com.bazarPepe.eccomerce.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImplementation implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final EntityDtoMapper entityDtoMapper;


    @Override
    public Response registerUser(UserDto registrationRequest) {

        //ASIGNA POR DEFECTO EL ROL DE USER
        UserRole role=UserRole.USER;

        // SI EL CAMPO 'ROLE' NO ES NULO Y SE ESPECIFICA COMO "ADMIN", CAMBIA EL ROL A 'ADMIN'
        if(registrationRequest.getRole()!=null && registrationRequest.getRole().equalsIgnoreCase("admin")){
            role=UserRole.ADMIN;
        }

        //CREA UNA INSTANCIA DE USER CON BUILDER Y ASIGNA LOS CAMPOS RECIBIDOS EN LA SOLICITUD
        User user=User.builder()
                .name(registrationRequest.getName())
                .email(registrationRequest.getEmail())
                .password(passwordEncoder.encode(registrationRequest.getPassword()))
                .phoneNumber(registrationRequest.getPhoneNumber())
                .role(role)
                .build();

        //GUARDADO EN LA BASE DE DATOS Y MAPEADO A DTO
        try {

            //GUARDA EL USUARIO EN LA BASE DE DATOS
            User savedUser = userRepository.save(user);

            //MAPEA LA ENTIDAD USER EN UN DTO USANDO ENTITYDTOMAPPER
            UserDto userDto = entityDtoMapper.mapUserToDtoBasic(savedUser);

            //CONSTRUYE LA RESPUESTA EXITOSA CON EL USUARIO REGISTRADO
            return Response.builder()
                    .status(200)
                    .message("Usuario añadido exitosamente")
                    .user(userDto)
                    .build();
        } catch (Exception e) {

            //RETORNA RESPUESTA DE ERROR SI SALE ALGUN PROBLEMA
            return Response.builder()
                    .status(500)
                    .message("Error al registrar el usuario")
                    .build();
        }
    }

    @Override
    public Response loginUser(LoginRequest loginRequest) {

        //BUSCA EL USUARIO POR EMAIL, LANZA EXCEPCION SI NO LO ENCUENTRA
        User user=userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(()->new NotFoundException("El email no se ha encontrado"));

        //COMPRUEBA SI ES LA CONTRASEÑA CORRECTA, SINO LANZA EXCEPCION
        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())){
            throw new InvalidCredentialsException("La contraseña es incorrecta");
        }

        //GENERA EL TOKEN JWT Y CREA LA RESPUESTA DE EXITO
        String token= jwtUtils.generateToken(user);
        return Response.builder()
                .status(200)
                .message("Login con exito")
                .token(token)
                .expirationTime("6 meses")
                .role(user.getRole().name())
                .build();

    }

    @Override
    public Response getAllUsers() {
        try {
            //OBTIENE TODOS LOS USUARIOS Y LOS MAPEAS A UserDto
            List<User> users = userRepository.findAll();
            List<UserDto> userDtos = users.stream()
                    .map(entityDtoMapper::mapUserToDtoBasic)
                    .toList();

            //SI TODO SALE BIEN, DEVUELVE UNA RESPUESTA EXITOSA
            return Response.builder()
                    .status(200)
                    .message("Éxito")
                    .userList(userDtos)
                    .build();

        } catch (Exception exception) {
            //SI OCURRE ALGÚN ERROR, DEVUELVE UNA RESPUESTA DE ERROR
            return Response.builder()
                    .status(500)
                    .message("Error al obtener la lista de usuarios: " + exception.getMessage())
                    .build();
        }
    }

    @Override
    public User getLoginUser() {
        //OBTIENE LA AUTENTIFICACION DEL USUARIO DEL CONTEXTO DE SEGURIDAD
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();

        //EXTRAE EL EMAIL DEL USUARIO AUTENTIFICADO
        String email=authentication.getName();

        //LOGUEA EL EMAIL PARA REGISTROS DE SEGUIMIENTO
        log.info("User email es: " +email);

        //SE BUSCA EL USUARIO POR EL EMAIL, SI NO SE ENCUENTRA LANZA EXCEPCION
        return userRepository.findByEmail(email)
                .orElseThrow(()->new UsernameNotFoundException("No se ha encontrado el usuario"));
    }

    @Override
    public Response getUserInfoAndOrderHistory() {

        //OBTIENE EL USUARIO AUTENTIFICADO
        User user=getLoginUser();

        //MAPEO A USERDTO AÑADIENDO ADDRESS Y ORDER HISTORY
        UserDto userDto=entityDtoMapper.mapUsertoDtoPlusAddressAndOrderHistory(user);

        //CONSTRUYE UNA RESPUESTA EXITOSA
        return Response.builder()
                .status(200)
                .user(userDto)
                .build();
    }
}
