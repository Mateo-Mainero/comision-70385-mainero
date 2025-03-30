import { generateToken } from "../utils/jwt.js"
import { UserDTO } from "../utils/userDTO.js";



export const current = async (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.status(200).send(userDTO);
};
export const login = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({ message: "Usuario o contraseña no válidos" });
        }

        const token = generateToken(req.user);

        res.cookie('coderCookie', token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000,
        });

        res.status(200).send({ message: "Usuario logueado correctamente" });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Error al loguear usuario" });
    }
};

export const register = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send({ message: "El mail ya está registrado" });
        }
        res.status(201).send({ message: "Usuario creado correctamente" });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Error al registrar usuario" });
    }
};
export const viewRegister = (req,res) => {
    res.status(200).render('templates/register', {
        title: "Registro de Usuario",
        url_js: "/js/register.js",
    })
}

export const viewLogin = (req,res) => {
    res.status(200).render('templates/login', {
        title: "Inicio de Sesion de Usuario",
        url_js: "/js/login.js",
    })
}

export const githubLogin = (req,res) => {
    try {
        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name
        } 
        const token = generateToken(req.user)
        res.status(200).cookie('coderCookie', token, {
            httpOnly: true,
            secure: false, //Evitar errores por https
            maxAge: 3600000 //Una hora
        }).redirect("/api/products")
    }catch(e) {
        console.log(e); 
        res.status(500).send("Error al loguear usuario")
    }  
}