Here is the documentation of the project:

# Moon Sight

Moon Sight is a web application that displays a 3D model of the moon in its current phase and gives the possibility to change the date while updating the model.

## Table of Contents

- [Tech Stack](#tech-stack)
- [How it works](#how-it-works)
- [Code Conventions](#code-conventions)
- [Files Structure](#files-structure)

## Tech Stack

The following technologies are used in this project:

- **TypeScript:** The entire application logic is written using TypeScript, an open-source language that builds on JavaScript by adding static type definitions.
- **Vite:** Vite is a modern front-end build tool that provides a faster and leaner development experience for modern web projects. It is used as the build tool in this project.
- **Three.js:** Three.js is a cross-browser JavaScript library used to create and display animated 3D computer graphics on a Web browser. In this project, it is used to create the 3D model of the moon.
- **GSAP:** The GreenSock Animation Platform (GSAP) is a suite of JavaScript tools for high-performance HTML5 animations that work in all major browsers. It's used in this project for animations.
- **Tailwind CSS:** A utility-first CSS framework used for styling the application.

## How it works

The application starts by loading the main TypeScript file `main.ts` which imports the main application styles and instantiates the `Experience` class.

The `Experience` class is a singleton class that initializes and manages the entire application. It sets up the main application entities such as the camera, renderer, world, and also handles the overall application updates and resizes.

The `Camera` class sets up the 3D camera and handles its updates and resizing. The `Renderer` class handles rendering the 3D objects onto the canvas.

The `World` class is responsible for handling the moon phase changes, updating the moon's data, and managing the UI for changing the date.

The `ResourcesManager` class handles the loading of external resources.

## Code Conventions

The project follows the standard TypeScript and SCSS style guides. Here are some of the key conventions:

- Use PascalCase for TypeScript class names and interfaces.
- Use camelCase for variable and function names.
- Use SCSS for structuring the styles and use kebab-case for class names.
- Use descriptive names for functions and variables.
- Keep functions small and focused on a single task.

## Files Structure

The project is structured as follows:

- `index.html`: The main HTML file.
- `style.scss`: The main styles file.
- `main.ts`: The main TypeScript file that bootstraps the application.
- `Experience.ts`: The main class that sets up and manages the application.
- `Camera.ts`: The class that sets up the 3D camera.
- `Renderer.ts`: The class that handles rendering the 3D objects onto the canvas.
- `World.ts`: The class that handles the moon phase changes and the UI for changing the date.
- `ResourcesManager.ts`: The class that handles the loading of external resources.
