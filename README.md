Document Template for vida.io
=============

Github template for vida.io

Python is required to run locally: sh ./run_server.sh

Describe your document in manifest.json. Format is as follows:

    {
      "data": ["document.json"],
      "javascript": ["document.js"],
      "stylesheet": ["document.css"],
      "html": ["document.html"],
      "properties": [
        {"label":"Data Column 0 (X Axis)","name":"data0","type":"data_column","value":null},
        {"label":"Data Column 1 (Y Axis)","name":"data1","type":"data_column","value":null},
        {"label":"Label 0","name":"label0","type":"string","value":"label 0"},
        {"label":"Label 1","name":"label1","type":"string","value":"label 1"},
        {"label":"Color 0","name":"color0","type":"color","value":"#0f608b"},
        {"label":"Color 1","name":"color1","type":"color","value":"#99ccff"},
        {"label":"Width","name":"width","type":"number","value":800},
        {"label":"Height","name":"height","type":"number","value":400}
      ]
    }
    
    data: list of data files for your document
    javascript: list of javascript files for your document
    stylesheet: list of stylesheet files for your document
    html: list of html files for your document
    properties: external properties for vida.io user interface
    properties.label: property label
    properties.name: property name
    properties.type: property type (string/number/boolean/color/data_column)
    properties.value: default property value

Copyright Vida Lab Inc. 2014

License: BSD
