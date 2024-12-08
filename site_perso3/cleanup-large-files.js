const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Taille limite en octets (ici, 100 MB)
const FILE_SIZE_LIMIT = 100 * 1024 * 1024;

// Chemin du répertoire Git
const GIT_REPO_PATH = path.resolve(__dirname);

// Fonction pour parcourir tous les fichiers dans un répertoire
function findLargeFiles(dir) {
  const largeFiles = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory() && file.name !== ".git") {
      // Appel récursif pour les sous-dossiers
      largeFiles.push(...findLargeFiles(fullPath));
    } else if (file.isFile()) {
      const stats = fs.statSync(fullPath);
      if (stats.size > FILE_SIZE_LIMIT) {
        largeFiles.push(fullPath);
      }
    }
  }

  return largeFiles;
}

// Supprime les fichiers de Git
function removeFilesFromGit(files) {
  files.forEach((file) => {
    console.log(`Removing ${file} from Git history...`);
    exec(
      `git filter-repo --path "${file}" --invert-paths`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error removing ${file}: ${stderr}`);
        } else {
          console.log(`Successfully removed ${file}`);
        }
      }
    );
  });
}

// Script principal
(function main() {
  const largeFiles = findLargeFiles(GIT_REPO_PATH);

  if (largeFiles.length === 0) {
    console.log("No files exceeding the size limit were found.");
    return;
  }

  console.log("Large files found:", largeFiles);

  // Supprime les fichiers du Git
  removeFilesFromGit(largeFiles);
})();
