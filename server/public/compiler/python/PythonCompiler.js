const fs = require("fs");
const { exec } = require("child_process");

function compileAndRunPython(req, res) {
  const pythonCode = req.body.code;
  const input = req.body.input; // Get custom input from request body

  const pythonFile = "Solution.py";
  const inputFile = "input.txt";

  fs.writeFileSync(pythonFile, pythonCode);

  if (input) {
    fs.writeFileSync(inputFile, input); // Save input to a file
  }

  const runCommand = input
    ? `python ${pythonFile} < ${inputFile}`
    : `python ${pythonFile}`;

  exec(runCommand, (runError, stdout, stderr) => {
    if (runError) {
      console.error("Execution failed:");
      console.error(stderr);
      res.send({ output: stderr, success: false });
      return;
    }

    res.send({ output: stdout, success: true });

    try {
      fs.unlinkSync(pythonFile);
      if (input) fs.unlinkSync(inputFile);
    } catch (deleteError) {
      console.error(`Error deleting files: ${deleteError.message}`);
    }
  });
}

module.exports = compileAndRunPython;
