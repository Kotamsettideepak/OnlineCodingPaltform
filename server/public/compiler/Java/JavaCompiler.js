const fs = require("fs");
const { exec } = require("child_process");

function compileAndRunJava(req, res) {
  const javaCode = req.body.code;
  const input = req.body.input; // Get custom input from request body
  console.log(javaCode);
  console.log(input);

  const classNameMatch = javaCode.match(/public\s+class\s+(\w+)/);
  const className = classNameMatch ? classNameMatch[1] : "Solution";

  const javaFile = `${className}.java`;
  const classFile = `${className}.class`;
  const inputFile = "input.txt";

  fs.writeFileSync(javaFile, javaCode);

  if (input) {
    fs.writeFileSync(inputFile, input); // Save input to a file
  }

  exec(`javac ${javaFile}`, (compileError, stdout, stderr) => {
    if (compileError) {
      console.error("Compilation failed:");
      console.error(stderr);
      res.send({ output: stderr, success: false });
      return;
    }

    const runCommand = input
      ? `java ${className} < ${inputFile}`
      : `java ${className}`;

    exec(runCommand, (runError, stdout, stderr) => {
      if (runError) {
        console.error("Execution failed:");
        console.error(stderr);
        res.send({ output: stderr, success: false });
        return;
      }

      res.send({ output: stdout, success: true });

      try {
        fs.unlinkSync(javaFile);
        fs.unlinkSync(classFile);
        if (input) fs.unlinkSync(inputFile);
      } catch (deleteError) {
        console.error(`Error deleting files: ${deleteError.message}`);
      }
    });
  });
}

module.exports = compileAndRunJava;
