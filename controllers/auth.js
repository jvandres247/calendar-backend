const { response } = require("express");
const bcrytp = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un usuario con ese correo",
      });
    }

    usuario = new Usuario(req.body);

    //Encriptar contraseña
    const salt = bcrytp.genSaltSync();
    usuario.password = bcrytp.hashSync(password, salt);

    await usuario.save();

    //Genera JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Comuniquese con el administrador",
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe",
      });
    }

    //Validar password
    const validPassword = bcrytp.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }

    //Genera JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      msg: "login",
      uid: usuario.id,
      name: usuario.name,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Comuniquese con el administrador",
    });
  }
};

const revalidarToken = async(req, res = response) => {

  const {uid, name} = req;

  const token = await generarJWT(uid, name);

  res.json({
    ok: true,
    token
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
