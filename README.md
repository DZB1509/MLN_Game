# Game Puzzle Câu Hỏi - Vượt Chướng Ngại Vật

**Game Puzzle Câu Hỏi** là một trò chơi giáo dục kết hợp ghép hình puzzle và quiz kiến thức, nhằm giúp người chơi rèn luyện khả năng sắp xếp từ ngữ, hiểu biết về tình yêu quê hương đất nước và tinh thần trách nhiệm với Tổ quốc.
- Intro với video nền cinematic
- Giao diện chính: puzzle bên trái, quiz bên phải
- Pháo hoa chúc mừng khi hoàn thành

### Tính năng chính
- **Puzzle 10 mảnh**: Chia ảnh thành 10 mảnh ghép hình zigzag(SVG polygon), click mảnh để mở câu hỏi.
- **Quiz sắp xếp chữ cái**: Mỗi mảnh tương ứng với một từ bị xáo trộn (ví dụ: "ó / n / g / b / ắ" → "Gắn bó"), trả lời đúng sẽ mở mảnh và hiện popup giải thích ý nghĩa.
- **Đếm ngược thời gian**: Khi chọn mảnh, có 6 giây để trả lời (hiện popup đếm ngược + tiếng tick mỗi giây). Hết giờ → tiếng còi hú + thông báo sai.
- **Âm thanh phản hồi sống động**: 
  + Tick đếm ngược, beep hết giờ, fail sai.
  + Sound đúng (correct.mp3) khi mở mảnh.
  + Nhạc pháo hoa + nhạc chúc mừng khi "Nổ hũ".
- **Pháo hoa chúc mừng**: Pháo hoa canvas hoành tráng (12 giây) → tự fade out → hiện popup "Nổ hũ".
- **Easter egg đặc biệt**:
  + Nổ hũ: Click nút vàng → hiện ngay thông điệp "Vùng trời Tổ Quốc" với ý nghĩa sâu sắc.
  + Giải mã (Hangman): Mini-game đoán 14 chữ cái của từ bí mật "VÙNGTRỜITỔQUỐC". Có hiển thị chữ sai, thông báo tạm thời, đoán đúng → tự động "Nổ hũ".
- Intro cinematic: Video nền loop + nút unmute/skip.

### Công nghệ sử dụng
- HTML5, CSS3, JavaScript (vanilla JS).
- SVG cho puzzle động (polygon + image background).
- Canvas cho hiệu ứng pháo hoa particle.
- Audio/Video: HTML5 <audio> và <video> (MP3, MP4).
- Không phụ thuộc framework hay server → chạy offline hoàn toàn.

### Cách chạy
1. Clone repository.
2. Mở file `index.html` bằng trình duyệt (không cần server)
Đảm bảo cấu trúc thư mục đầy đủ:
├── index.html
├── style.css
├── script.js
├── image.jpg          (ảnh ghép chính - lá cờ hoặc hình yêu nước)
├── background.jpg     (nền body)
├── intro.mp4          (video intro)
├── beep.mp3, fail.mp3, tick.mp3, correct.mp3, fireworks.mp3, nohu.mp3
3. Mở file index.html trực tiếp bằng trình duyệt (Chrome/Firefox khuyến nghị).
4. Không cần server (local file OK), nhưng nếu có warning mixed content thì dùng Live Server (VS Code extension).

Chơi ngay để khám phá và lan tỏa tinh thần yêu nước qua từng mảnh ghép!

Chúc bạn vui vẻ và học hỏi được nhiều điều ý nghĩa!

Tác giả:
Được phát triển bởi TDatZ20 – với tình yêu dành cho quê hương Việt Nam ❤️.
Ý tưởng nhằm lan tỏa tinh thần yêu nước qua trò chơi giáo dục nhẹ nhàng.
