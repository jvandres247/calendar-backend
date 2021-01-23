/**
    Rutas de usuarios / Auth
    host + /api/auth
*/
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  crearUsuario,
  loginUsuario,
  revalidarToken,
} = require("../controllers/auth");
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');

router.post(
  "/new",
  [
    //midleware
    check("name", "El nombre el obligatorio").not().isEmpty(),
    check("email", "El email el obligatorio").isEmail(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos
  ],
  crearUsuario
);

router.post(
  "/",
  [
    //midleware
    check("email", "El email el obligatorio").isEmail(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos
  ],
  loginUsuario
);

router.get("/renew", validarJWT, revalidarToken);

module.exports = router;
