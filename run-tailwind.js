// run-tailwind.js
const { exec } = require("child_process");

// Run Tailwind CLI
exec(
  "npx tailwindcss init -p",
  (err, stdout, stderr) => {
    if (err) {
      console.error(`Error: ${err.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    // console.log(stdout);
  }
);