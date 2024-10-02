import S from "s-js"
import createElement from "./createElement.ts"
import type {Props} from "./createElement.ts"
import {Image} from "image-js"

function isSignal(s:any){
  return typeof(s) == "function";
}


function h(
	tag: string,
	props: Props = {},
	children: (HTMLElement | string)[] = []
): HTMLElement {
  Object.entries(props).forEach(([k, v])=>{
    console.group(k)
    console.log(v, isSignal(v));
    console.groupEnd()
  })
  return createElement(tag, props, children);
}



let greeting = S.data("Hello");
let name = S.data("world");


let noise_width = S.value(64);
let noise_height= S.value(64);
let blur_radius = S.value(16);
let blur_sigma = S.value(5);

type ImageType = {
  width: number;
  height: number;
  data: Uint8ClampedArray
};

function noise(width:number=64, height:number=64):ImageType{
  // Create a imgDataArray to hold pixel data (4 floats per pixel: R, G, B, A)
  const imgDataArray = new Uint8ClampedArray(width * height * 4);

  // Fill the imgData with random values between 0 and 1
  for (let i = 0; i < imgDataArray.length; i += 4) {
      imgDataArray[i] = Math.random();     // Red (0 to 1)
      imgDataArray[i + 1] = Math.random(); // Green (0 to 1)
      imgDataArray[i + 2] = Math.random(); // Blue (0 to 1)
      imgDataArray[i + 3] = 1.0;           // Alpha (1.0 fully opaque)
  }
  return {
    width: width,
    height: height,
    data: imgDataArray
  };
}

function blur(radius:number, sigma:number, input: ImageType):ImageType{
  let img = new Image(input.width, input.height, input.data, { 
    kind: 'RGBA',  // or 'RGB', 'RGBA', etc., depending on your data
    bitDepth: 8   // Indicates image bit depth
  });

  // Apply Gaussian filter
  img = img.gaussianFilter({
    radius: radius,
    sigma: sigma,
    channels: undefined, // Apply to all channels by default
    border: "copy"
  });

  // Convert Uint8Array data back to Float32Array, if required
  const imgData = new Uint8ClampedArray(img.data);

  // Return the blurred image as ImageType
  return {
    width: img.width,
    height: img.height,
    data: imgData
  };
}



S.root(() => {
  console.log("RUN ROOT");
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
    h("input", {
      type: "range",
      min: "0", max: "64",
      oninput: e=>{
        blur_radius(parseInt(e.target.value));
      }
    }),
    h("input", {
      type: "range",
      min: "0", max: "64",
      oninput: e=>{
        blur_sigma(parseInt(e.target.value));
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
    const img = blur(blur_radius(),blur_sigma(),
      noise(noise_width(), noise_height())
    ); // make image

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