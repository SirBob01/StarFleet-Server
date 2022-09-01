const { exec } = require('child_process');
const fs = require('fs');

/**
 * Build the tsx source base if not a deployment package (from CodeArtifacts)
 */
if (fs.existsSync('./src')) {
  console.log('Building server code...');
  exec('npm run build');
}
