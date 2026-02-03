let fileData = null;
let outputData = null;
let outputName = "";
let fileType = ""; // image/png, image/jpeg

// ===== Infile =====
document.getElementById("infileBtn").addEventListener("click", () => {
    document.getElementById("infile").click();
});

document.getElementById("infile").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  fileType = file.type;
  document.getElementById("inPath").value = file.name;

  const reader = new FileReader();
  reader.onload = () => {
    fileData = new Uint8Array(reader.result);
  };
  reader.readAsArrayBuffer(file);
});

// ===== RC4 =====
function rc4(data, key) {
  let S = new Uint8Array(256);
  for (let i = 0; i < 256; i++) S[i] = i;

  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + key.charCodeAt(i % key.length)) % 256;
    [S[i], S[j]] = [S[j], S[i]];
  }

  let i = 0;
  j = 0;
  let result = new Uint8Array(data.length);

  for (let k = 0; k < data.length; k+= 4) {
    for (let c = 0; c < 3; c++) {
      i = (i + 1) % 256;
      j = (j + S[i]) % 256;
      [S[i], S[j]] = [S[j], S[i]];
      const rnd = S[(S[i] + S[j]) % 256];
      result[k + c] = data[k + c] ^ rnd;
    }
    result[k + 3] = data[k + 3];
  }

  return result;
}

function minimalHeaderSize(data) {
  // PNG → เก็บถึง IHDR + CRC (33 bytes)
  if (
    data[0] === 0x89 &&
    data[1] === 0x50 &&
    data[2] === 0x4E &&
    data[3] === 0x47
  ) return 33;

  // JPEG → เก็บ SOI + JFIF header
  if (data[0] === 0xFF && data[1] === 0xD8) return 417;

  return 64; // fallback
}

// ===== RC4 with Header =====
function rc4WithHeader(data, key) {
  const headerSize = minimalHeaderSize(data);

  const header = data.slice(0, headerSize);
  const body = data.slice(headerSize);

  const encryptedBody = rc4(body, key);

  const result = new Uint8Array(data.length);
  result.set(header, 0);
  result.set(encryptedBody, headerSize);

  return result;
}

function processImage(mode) {
  const key = document.getElementById("key").value;
  if (!fileData || !key) {
    alert("กรุณาเลือกไฟล์และใส่ Key");
    return;
  }

  const blob = new Blob([fileData], { type: fileType });
  const img = new Image();
  img.src = URL.createObjectURL(blob);

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const processed = rc4(imgData.data, key);
    imgData.data.set(processed);

    ctx.putImageData(imgData, 0, 0);

    canvas.toBlob((b) => {
      outputData = b;
      outputName = mode === "encrypt"
        ? "encrypted.png"
        : "decrypted.png";

      document.getElementById("outPath").value = outputName;
    }, "image/png");
  };
}

// ===== Encrypt =====
function encrypt() {
  processImage("encrypt");
}


// ===== Decrypt =====
function decrypt() {
  processImage("decrypt");
}

// ===== Download =====
function download() {
  if (!outputData) {
    alert("ยังไม่มีไฟล์ให้ดาวน์โหลด");
    return;
  }

  const link = document.createElement("a");
  link.href = URL.createObjectURL(outputData);
  link.download = outputName;
  link.click();

  fileData = null;
  outputData = null;
  fileType = "";

  document.getElementById("infile").value = "";
  document.getElementById("inPath").value = "";
  document.getElementById("outPath").value = "";
  document.getElementById("key").value = "";
}
