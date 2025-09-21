#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const DEFAULT_NAME = 'saas-react-starter';
const DEFAULT_TITLE = 'SaaS React Starter';

function replaceInFile(filePath, searchValue, replaceValue) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(new RegExp(searchValue, 'g'), replaceValue);
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function replaceInDirectory(dirPath, searchValue, replaceValue, extensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.html', '.md', '.css']) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules and .git directories
      if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') {
        continue;
      }
      replaceInDirectory(fullPath, searchValue, replaceValue, extensions);
    } else if (stat.isFile()) {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        replaceInFile(fullPath, searchValue, replaceValue);
      }
    }
  }
}

function kebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function titleCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('SaaS React Starter - Project Renaming Tool');
  console.log('=============================================\n');

  // Get project name
  const projectName = await askQuestion(`Enter your project name (kebab-case, e.g., my-saas-app): `);

  if (!projectName) {
    console.log('Error: Project name is required!');
    rl.close();
    return;
  }

  // Validate project name (basic kebab-case validation)
  if (!/^[a-z][a-z0-9-]*$/.test(projectName)) {
    console.log('Error: Invalid project name! Use lowercase letters, numbers, and hyphens only.');
    rl.close();
    return;
  }

  // Get project title
  const defaultTitle = titleCase(projectName);
  const projectTitleInput = await askQuestion(`Enter your project title (default: ${defaultTitle}): `);
  const projectTitle = projectTitleInput || defaultTitle;

  console.log('\nConfiguration:');
  console.log(`   Project Name: ${projectName}`);
  console.log(`   Project Title: ${projectTitle}`);

  const confirm = await askQuestion('\nProceed with renaming? (y/n): ');

  if (confirm.toLowerCase() !== 'y') {
    console.log('Renaming cancelled.');
    rl.close();
    return;
  }

  console.log('\nRenaming project...\n');

  // Replace in package.json
  console.log('   Updating package.json...');
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = projectName;
    packageJson.description = `${projectTitle} - A modern SaaS application`;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }

  // Replace in index.html
  console.log('   Updating index.html...');
  const indexHtmlPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    replaceInFile(indexHtmlPath, '<title>.*?</title>', `<title>${projectTitle}</title>`);
  }

  // Replace project name in all relevant files
  console.log('   Updating project references...');
  replaceInDirectory(__dirname, DEFAULT_NAME, projectName);
  replaceInDirectory(__dirname, DEFAULT_TITLE, projectTitle);

  // Update environment files
  console.log('   Updating environment files...');
  const envExamplePath = path.join(__dirname, '.env.example');
  if (fs.existsSync(envExamplePath)) {
    replaceInFile(envExamplePath, 'VITE_APP_NAME=.*', `VITE_APP_NAME="${projectTitle}"`);
  }

  // Clean up the rename script itself
  console.log('   Cleaning up rename script...');
  const scriptPath = path.join(__dirname, 'rename-project.js');

  console.log('\nProject renamed successfully!');
  console.log('\nNext steps:');
  console.log('   1. Run: npm install');
  console.log('   2. Configure your .env file');
  console.log('   3. Run: npm run dev');
  console.log('\nHappy coding!\n');

  rl.close();

  // Remove the rename script after successful execution
  setTimeout(() => {
    if (fs.existsSync(scriptPath)) {
      fs.unlinkSync(scriptPath);
      console.log('Rename script removed.');
    }
  }, 100);
}

main().catch(error => {
  console.error('An error occurred:', error);
  rl.close();
  process.exit(1);
});