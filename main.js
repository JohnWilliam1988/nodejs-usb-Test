// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("path");
const usb = require("usb");

let windows = [];

const webusb = new usb.WebUSB({
  allowAllDevices: true,
});

const showDevices = async () => {
  (async () => {
    // Returns first matching device
    const device = await webusb.requestDevice({
      filters: [{ productId: 0x5750, vendorId: 0x0483 }],
    });

    if (device) {
      console.log("device 不为空");
      console.log(device); // WebUSB device
      device.open();

      device.selectConfiguration(1); //似乎不需要
      device.claimInterface(
        device.configurations[0].interfaces[0].interfaceNumber
      );
      console.log(device.configurations[0].interfaces[0]);
      console.log(device.configurations[0].interfaces[0].alternate.endpoints);

      var allEndPoints =
        device.configurations[0].interfaces[0].alternate.endpoints;

      // inEndpoint.on("data", function (data) {
      //   console.log(data);
      // });
      // inEndpoint.on("error", function (error) {
      //   console.log(error);
      // });

      var inEndpoint = null;

      for (endpoint of allEndPoints) {
        console.log(endpoint["direction"]);
        if (endpoint["direction"] === "out") {
          //const str = "BD:31,0;";
          //const str = "BD:100,8;";
          //const str = "RSVER;";
          const str =
            "IN IN U0,0 U2809,691 D2748,642 D2686,597 D2622,557 D2556,522 D2489,491 D2421,466 D2353,447 D2287,433 D2217,424 D2151,421 D2076,424 D2004,434 D1932,450 D1865,472 D1800,500 D1734,535 D1672,576 D1613,622 D1558,674 D1507,730 D1460,792 D1416,860 D1377,930 D1341,1007 D1311,1088 D1285,1173 D1264,1260 D1249,1346 D1239,1439 D1234,1529 D1235,1621 D1240,1715 D1251,1809 D1267,1900 D1289,1996 D1315,2087 D1346,2178 D1381,2266 D1420,2350 D1465,2434 D1514,2514 D1566,2590 D1449,2588 D1333,2595 D1218,2613 D1109,2640 D1001,2677 D900,2722 D806,2776 D718,2839 D639,2910 D574,2983 D519,3063 D475,3147 D444,3234 D426,3322 D421,3412 D429,3502 D441,3558 D458,3613 D480,3666 D509,3720 D540,3768 D578,3818 D617,3862 D664,3907 D714,3948 D768,3987 D826,4022 D884,4052 D948,4081 D1016,4106 D1085,4127 D1153,4143 D1224,4156 D1295,4165 D1369,4170 D1443,4170 D1517,4167 D1591,4160 D1663,4148 D1737,4132 D1805,4114 D1874,4090 D1941,4063 D2005,4033 D2066,3999 D2123,3962 D2177,3922 D2227,3879 D2195,3942 D2168,4005 D2144,4074 D2124,4143 D2108,4213 D2096,4285 D2088,4359 D2084,4435 D2085,4512 D2089,4586 D2098,4660 D2111,4737 D2127,4808 D2149,4880 D2174,4950 D2203,5017 D2235,5081 D2270,5142 D2309,5199 D2350,5252 D2397,5304 D2444,5349 D2494,5389 D2545,5425 D2599,5456 D2654,5482 D2711,5502 D2766,5517 D2822,5526 D2879,5530 D2937,5529 D2994,5522 D3080,5501 D3166,5466 D3246,5420 D3324,5359 D3396,5288 D3460,5206 D3516,5114 D3564,5014 D3603,4907 D3631,4798 D3650,4683 D3658,4568 D3657,4447 D3645,4328 D3623,4214 D3590,4102 D3673,4133 D3759,4160 D3847,4183 D3934,4201 D4023,4214 D4114,4223 D4206,4227 D4299,4227 D4391,4221 D4481,4211 D4568,4196 D4654,4177 D4737,4154 D4821,4125 D4902,4092 D4979,4054 D5053,4013 D5122,3968 D5187,3919 D5245,3869 D5301,3814 D5353,3755 D5398,3694 D5437,3633 D5470,3569 D5498,3503 D5520,3436 D5536,3366 D5546,3295 D5550,3225 D5547,3157 D5539,3086 D5524,3016 D5504,2948 D5478,2881 D5444,2813 D5407,2750 D5363,2686 D5313,2624 D5258,2566 D5198,2510 D5134,2457 D5065,2408 D4996,2364 D4919,2322 D4842,2286 D4758,2251 D4675,2223 D4590,2198 D4502,2178 D4411,2162 D4318,2151 D4227,2145 D4131,2143 D4042,2147 D3950,2155 D3860,2168 D3773,2185 D3688,2207 D3605,2234 D3526,2264 D3446,2300 D3374,2338 D3302,2382 D3322,2304 D3338,2226 D3351,2143 D3358,2062 D3362,1979 D3361,1895 D3356,1810 D3346,1723 D3332,1636 D3314,1553 D3292,1470 D3266,1385 D3235,1303 D3201,1224 D3164,1148 D3122,1071 D3079,1001 D3030,931 D2979,865 D2924,803 D2868,745 D2809,691 U0,0 U0,0 @";
          const bytes = str.split("").map((char) => char.charCodeAt(0));
          const data = new Uint8Array(bytes);
          device.transferOut(endpoint["endpointNumber"], data).catch((ss) => {
            console.log(ss);
          });
        } else if (endpoint["direction"] === "in") {
          console.log("endpoint  === in");
          device
            .transferIn(endpoint["endpointNumber"], 64)
            .then(function (res) {
              console.log(res);
              console.log(new TextDecoder().decode(res.data.buffer));
            });
        } else {
          console.log(endpoint);
        }
      } 

      //   const outEndpoint =
      //     device.configurations[0].interfaces[0].alternate.endpoints.map(
      //       (d) => `${d.direction} === 'out' `
      //     );

      //  console.log(outEndpoint);

      //   var endPoints = device.configurations[0].interfaces[0].endpoints;

      //   console.log("endpoints len : " + endPoints.length);
    }
  })();

  //   const devices = await webusb.getDevices();
  //   const text = devices.map(
  //     (d) => `${d.vendorId}\t${d.productId}\t${d.serialNumber || "<no serial>"}`
  //   );
  //   text.unshift("VID\tPID\tSerial\n-------------------------------------");
  //   windows.forEach((win) => {
  //     if (win) {
  //       win.webContents.send("devices", text.join("\n"));
  //     }
  //   });
  //   for (const device of devices) {
  //     console.log("vendorId: " + device.vendorId);
  //     console.log("productId: " + device.productId);
  //     console.log("serialNumber: " + device.serialNumber);
  //     if (device.vendorId === 1155 && device.productId === 22352) {
  //       await device
  //         .open()
  //         .then(() => device.selectConfiguration(1))
  //         .then(
  //           () =>
  //             device.claimInterface(
  //               device.configuration.interfaces[0].interfaceNumber
  //             )
  //           //const data = new Uint8Array([1, ...hexToRgb(colourPicker.value)]);
  //           // const data = "BD:31,0;";
  //           // await device.transferOut(2, data);
  //         )
  //         .then(() => {
  //           device
  //             .controlTransferOut({
  //               requestType: "standard",
  //               recipient: "interface",
  //               request: 0x42,
  //               value: 0x1234,
  //               index: 0x0000,
  //             })
  //             .then(() => {
  //               const str = "2";
  //               const bytes = str.split("").map((char) => char.charCodeAt(0));
  //               const data = new Uint8Array(bytes);
  //               device.transferOut(2, data).catch((ss) => {
  //                 console.log(ss);
  //               });
  //             });
  //         });
  //     }
  //   }
};

const createWindow = () => {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  win.loadFile("index.html");

  // Open the DevTools.
  // win.webContents.openDevTools()

  windows.push(win);
  showDevices();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  webusb.addEventListener("connect", showDevices);
  webusb.addEventListener("disconnect", showDevices);

  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  webusb.removeEventListener("connect", showDevices);
  webusb.removeEventListener("disconnect", showDevices);

  app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
