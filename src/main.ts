import S from "s-js"
import h from "./createElement.ts"

let greeting = S.data("Hello");
let name = S.data("world");

let noise_width = S.value(64);
let noise_height= S.value(64);

type Image = {
  width: number;
  height: number;
  data: Float32Array
};

function noise(width:number=64, height:number=64):Image{
  // Create a Float32Array to hold pixel data (4 floats per pixel: R, G, B, A)
  const floatImageData = new Float32Array(width * height * 4);

  // Fill the Float32Array with random values between 0 and 1
  for (let i = 0; i < floatImageData.length; i += 4) {
      floatImageData[i] = Math.random();     // Red (0 to 1)
      floatImageData[i + 1] = Math.random(); // Green (0 to 1)
      floatImageData[i + 2] = Math.random(); // Blue (0 to 1)
      floatImageData[i + 3] = 1.0;           // Alpha (1.0 fully opaque)
  }
  return {
    width: width,
    height: height,
    data: floatImageData
  };
}



S.root(() => {
  console.log("run root")
  const root = h("div", {}, [
    h("input", {
      type: "text",
      oninput: e=>{
        name(e.target.value);
      }
    }),
    h("div", {id:"textbox"}),
    h("input", {
      type: "range",
      min: "1", max: "512",
      oninput: e=>{
        noise_width(parseInt(e.target.value));
      }
    }),
    h("input", {
      type: "range",
      min: "1", max: "512",
      oninput: e=>{
        noise_height(parseInt(e.target.value));
      }
    }),
    h("br"),
    h("canvas", {id:"viewport"})
  ]);

  document.body.appendChild(root);


  S(()=>{
    // Update textbox
    console.log("update textbox")
    const textbox = document.getElementById("textbox");
    if(textbox){
      textbox.textContent = `${greeting()} ${name()}!`;
    }
  });

  S(()=>{
    // Preview image
    const img = noise(noise_width(), noise_height()); // make image

    // preview image on canvas
    const canvas:(HTMLCanvasElement|null) = document.getElementById("viewport");
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // convert to ImageData
        const uint8ImageData = new Uint8ClampedArray(img.width * img.height * 4);
        for (let i = 0; i < img.data.length; i++) {
            uint8ImageData[i] = Math.floor(img.data[i] * 255);
        }
        const imageData = new ImageData(uint8ImageData, img.width, img.height);
        
        // draw image data onto the canvas
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.putImageData(imageData, 0, 0);
      }
    }
  });
});