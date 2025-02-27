import sharp from 'sharp';
import fs from 'fs';

// 定义字符映射表，从密集到稀疏
const CHAR_MAP = '@%#*+=-:. ';

// 将灰度值映射到字符
function grayToChar(gray) {
  const index = Math.floor((gray / 255) * (CHAR_MAP.length - 1));
  return CHAR_MAP[index];
}

// 图片转字符画函数
async function imageToAscii(imagePath, width = 100) {
  try {
    // 使用 sharp 读取图片并调整大小
    const { data, info } = await sharp(imagePath)
      .resize({ width }) // 调整宽度，保持比例
      .grayscale() // 转为灰度图
      .raw() // 获取原始像素数据
      .toBuffer({ resolveWithObject: true });

    const { height } = info;
    let asciiArt = '';

    // 遍历像素数据，生成字符画
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const gray = data[y * width + x]; // 获取灰度值
        asciiArt += grayToChar(gray); // 转换为字符
      }
      asciiArt += '\n'; // 换行
    }

    return asciiArt;
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

// 示例：将图片转换为字符画并保存到文件
(async () => {
  const imagePath = `${__dirname}/../docs/test1.png`; // 替换为你的图片路径
  const asciiArt = await imageToAscii(imagePath, 80); // 调整宽度
  console.log(asciiArt); // 输出到控制台

  // 保存到文件
  // fs.writeFileSync('ascii-art.txt', asciiArt);
})();
