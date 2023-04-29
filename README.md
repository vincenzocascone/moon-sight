# Moon Sight Documentation

Moon Sight is a web application that displays a 3D model of the moon in its current phase and allows users to change the date while updating the model. The application is built using TypeScript classes, Vite, Three.js for 3D rendering, GSAP for animations, and Tailwind CSS for styling.

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Key Components](#key-components)
4. [Tasks](#tasks)

## Overview

The Moon Sight web application is designed to provide users with an interactive 3D model of the moon in its current phase. Users can change the date to see how the moon's phase changes over time. The application is built using a combination of modern web technologies and libraries, such as TypeScript, Vite, Three.js, GSAP, and Tailwind CSS.

## Tech Stack

The following technologies and libraries are used in the Moon Sight project:

1. **TypeScript**: TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It provides static typing and other features to improve the development experience.
2. **Vite**: Vite is a fast build tool and development server for modern web applications. It optimizes the build process and provides features such as hot module replacement for a fast development experience.
3. **Three.js**: Three.js is a JavaScript library used for creating and displaying 3D graphics in the browser using WebGL. In this project, it is used to create the 3D model of the moon and its phases.
4. **GSAP**: GreenSock Animation Platform (GSAP) is a powerful JavaScript library for creating high-performance animations. In this project, it is used to animate the loading bar and other elements.
5. **Tailwind CSS**: Tailwind CSS is a utility-first CSS framework that allows developers to build responsive and modern designs quickly. It is used for styling the application.

## Key Components

The Moon Sight application consists of several key components:

1. **Experience**: This is the main class responsible for initializing the application and managing various components, such as the camera, renderer, resources manager, and world.
2. **Camera**: The Camera class handles the creation and configuration of the Three.js camera instance used to view the 3D scene.
3. **Renderer**: The Renderer class is responsible for managing the WebGL renderer and updating the scene based on user interactions and animations.
4. **ResourcesManager**: This class is responsible for loading and managing resources, such as textures and fonts, required for the application.
5. **World**: The World class is responsible for creating and managing the 3D moon model and handling user interactions with the model.

## Tasks

- Fix Rendering Issue
- Check Orientation Device Sensor 
- Improve World Classes
- Improve loader
- Improve UI
- Improve Texts