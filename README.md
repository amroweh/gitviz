# GitViz

## Introduction

Gitviz is a visualizer tool for git. It simulates the functionality of git using JS objects and visualizes the different git entities using a force-directed network graph provided by the D3.JS library. In order to use it, just run your git commands on the terminal below.

## Currently supported commands are:

- git init
- git checkout 'some branch'
- git checkout -b 'some branch'
- git add .
- git commit -m 'some message'
- git merge 'commit1' 'commit2'
- git branch
- git branch -d 'some branch'

## Main Sections

This site contains three main sections: the terminal, the graph, and the info pane. The terminal is where you write in your git commands (make sure to start with a git init!). The graph is where your git state is visualised. The info pane contains some information about the different nodes in the graph. This can be accessed by clicking on one of the nodes in the graph.

## Settings

The 'settings' file contains all the stylistic settings for the graph. This can be modified to change the visualisation accordingly.
