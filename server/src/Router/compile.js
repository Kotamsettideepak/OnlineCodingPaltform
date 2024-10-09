const express = require("express");
const compileAndRunPython = require("../../public/compiler/python/PythonCompiler");
const compileAndRunJava = require("../../public/compiler/Java/JavaCompiler");
const Route = express.Router();

Route.post("/compile", (req, res) => {

  const { language } = req.body;


  switch (language) {
    case "java":
      compileAndRunJava(req, res);
      break;
    case "python":
      compileAndRunPython(req, res);
      break;
    case "javascript":
      compileAndRunJavaScript(req, res);
    default:
      res.status(400).send({ output: "Unsupported language", success: false });
  }
});

module.exports = Route;
