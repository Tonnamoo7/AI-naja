let model;
const result = document.getElementById('result');

// โหลดโมเดล
(async function () {
  try {
    model = await tf.loadLayersModel('model/model.json');
    console.log('✅ โหลดโมเดลสำเร็จ');
    result.innerText = '✅ โมเดลพร้อมแล้ว! อัปโหลดภาพแล้วคลิก "วิเคราะห์รูปภาพ"';
  } catch (err) {
    console.error('❌ โหลดโมเดลไม่สำเร็จ:', err);
    result.innerText = '⚠️ โหลดโมเดลไม่สำเร็จ ตรวจสอบโฟลเดอร์ /model/';
  }
})();

// คลาสและสีของแต่ละคลาส
const labels = ['โลก (Earth)', 'ดาวอังคาร (Mars)', 'กาแล็กซี (Galaxy)', 'ดวงจันทร์ (Moon)'];
const colors = ['#42a5f5', '#ef5350', '#ab47bc', '#90a4ae'];

// แสดงภาพที่อัปโหลด
document.getElementById('imageUpload').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => { document.getElementById('preview').src = e.target.result; };
  reader.readAsDataURL(file);
});

// ปุ่มวิเคราะห์
document.getElementById('predictBtn').addEventListener('click', async () => {
  const img = document.getElementById('preview');
  if (!img.src) return alert('กรุณาอัปโหลดภาพก่อน!');
  if (!model) return alert('โมเดลยังโหลดไม่เสร็จ!');

  const tensor = tf.browser.fromPixels(img)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .expandDims();

  const prediction = await model.predict(tensor).data();

  let html = `<h3>🌌 ผลการวิเคราะห์:</h3>`;
  for (let i = 0; i < prediction.length; i++) {
    const percent = (prediction[i] * 100).toFixed(2);
    const color = colors[i] || '#64b5f6';
    html += `
      <div class="bar-container">
        <span class="label">${labels[i]} — ${percent}%</span>
        <div class="bar">
          <div class="bar-fill" style="width:${percent}%; background: ${color};"></div>
        </div>
      </div>
    `;
  }

  result.innerHTML = html;
});
