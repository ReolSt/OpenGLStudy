if(typeof OGS == 'undefined')
{
    var OGS = {};
}

OGS.createShader = function(gl, type, source)
{
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success)
    {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

OGS.createProgram = function(gl, vertexShader, fragmentShader)
{
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(success)
    {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

document.body.onload = function()
{
    var main_canvas = document.createElement("canvas");
    with(main_canvas)
    {
        id = "mainCanvas"
        width = 800;
        height = 600;
    }
    var main_canvas_wrapper = document.createElement("div");
    with(main_canvas_wrapper)
    {
        id = "mainCanvasWrapper";
        with(style)
        {
            position = "absolute";
            top = "10px";
            left = "10px";
        }
        appendChild(main_canvas);
    }
    document.body.appendChild(main_canvas_wrapper);

    var gl = main_canvas.getContext("webgl");
    if(gl)
    {
        var vertexShaderSource = document.getElementById("vShader").text;
        var fragmentShaderSource = document.getElementById("fShader").text;

        var vertexShader = OGS.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        var fragmentShader = OGS.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        var program = OGS.createProgram(gl, vertexShader, fragmentShader);

        var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        var positions = [
            0, 0,
            0, 0.5,
          0.7, 0,
        ];
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array(positions),
          gl.STATIC_DRAW
        );
        
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        gl.enableVertexAttribArray(positionAttributeLocation);

        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer
        (
            positionAttributeLocation, size, type, normalize, stride, offset
        );

        // draw
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 3;
        gl.drawArrays(primitiveType, offset, count);
    }
}