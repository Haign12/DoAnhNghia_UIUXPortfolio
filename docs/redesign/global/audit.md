# Global-ready portfolio: đánh giá hiện trạng

Ngày: 2026-11-20. Nhánh: `redesign/global-ready`. Quy trình: `uiux-ai-workspace`, cỡ **L**, track
Redesign sản phẩm có code (`brownfield-redesign`) + track Portfolio
(`industry-playbooks/portfolio-career-positioning`, `portfolio-website`).

Mức thay đổi: **Refresh → Redesign trang chủ**; case study chỉ chuẩn hoá khối metadata (đợt sau).
Trạng thái cổng duyệt hướng: **CHƯA DUYỆT** (đang chờ chủ portfolio chọn).

## 1. Khung vấn đề

- **Người dùng:** recruiter và design hiring manager ở công ty sản phẩm global (remote hoặc relocation),
  đọc tiếng Anh, chưa biết các công ty Việt Nam trong phần kinh nghiệm.
- **Việc chính:** trong 5 giây biết ai, vai trò gì, ở đâu và làm được theo giờ nào; trong 60 giây xem
  2–4 project có vai trò và kết quả; trong 10 phút đọc một case study có quyết định và đánh đổi.
- **Làm sao để** một recruiter global quyết định mời phỏng vấn mà không phải đoán vai trò, mức độ thật
  của project hay khả năng làm việc từ xa?
- **Kết quả đo được (kế hoạch, chưa đo):** tỉ lệ phản hồi trên số đơn apply; số lượt mở case study từ
  trang chủ (cần analytics, hiện `UNKNOWN`).

## 2. Kiểm kê code (bản đồ sở hữu giao diện)

| File | Dòng | Sở hữu | Ghi chú |
|---|---|---|---|
| `brand.css` | 257 | token `--ds-*`, @font-face Source Sans 3 / Source Serif 4 | đơn sắc; `--ds-text-secondary` = primary (#111) ở chế độ sáng |
| `styles.css` | 1339 | toàn bộ trang chủ + nav + footer | nạp sau `brand.css`; đoạn cuối (Selected work) thêm ngày 2026-11-20 |
| `script.js` | 192 | menu, theme, bộ lọc More projects, anchor `#industry-*` | |
| `case-study.css` | 556 | khung case study chung | |
| `case-study-evidence-v4.css`, `case-recruiter-proof.css` | 141, 13 | lớp đè lên `case-study.css` | dấu hiệu phủ đè cũ, dọn ở đợt case study |
| `case-study.js` | 294 | nav case study, link live/source | |
| `index.html` | ~130 | 17 thẻ project, hero, experience, about, contact | không có generator |
| `qa/*.spec.mjs` | 6 file | Playwright | chưa chạy được: repo không có `package.json` / `@playwright/test` (mốc test `UNKNOWN`) |

Không có file sinh tự động. Ảnh "trước": `qa/global-before/` (desktop 1440, mobile 390).

## 3. ADN của portfolio

| Đặc điểm | ADN hay lỗi thực thi | Hướng xử lý |
|---|---|---|
| Đen trên nền giấy trắng, đơn sắc, không màu nhấn | ADN | giữ |
| Tiêu đề serif lớn (Source Serif 4), câu "Complexity, *made clear.*" có nghiêng | ADN (mâu thuẫn TASTE "một họ chữ, không serif/nghiêng làm điểm nhấn") | hướng A giữ, hướng B bỏ; chủ portfolio chọn |
| Thân chữ Source Sans 3, cỡ nhỏ 12–14 px ở thẻ | lỗi thực thi | tăng thân ≥ 15 px, bớt dòng |
| Ngôn ngữ "tài liệu có chỉ mục": đường kẻ mảnh, nhãn nhỏ | ADN | giữ |
| Ranh giới bằng chứng trung thực (independent concept, giới hạn kiểm chứng) | ADN, điểm khác biệt | giữ trong case study, không đặt dòng tiêu cực trên thẻ |
| Thumbnail collage nghiêng so le | ADN mới (2026-11-20) | giữ |
| Monogram XN serif | ADN | giữ; phương án logo mới đang bàn riêng |
| Cụm từ nối bằng " · " trên thẻ | lỗi thực thi (TASTE cấm) | viết lại |

## 4. Đối chiếu playbook recruiter (PASS / FAIL / UNKNOWN)

| Mục | Kết quả | Bằng chứng |
|---|---|---|
| Vai trò thống nhất giữa title, hero, CV | **FAIL** | title "Product Designer", hero "UI/UX & Product Designer", CV "UI/UX Designer" |
| Địa điểm, múi giờ, hình thức làm việc ở màn đầu | **FAIL** | không có ở trang nào; CV chỉ có số +84 |
| Học vấn quốc tế (Lyon 1) được dùng làm tín hiệu | **FAIL** | chỉ có trong CV |
| 5 giây: ai, làm gì, khác gì | PASS một phần | câu định vị tốt; thiếu địa điểm, vai trò thống nhất |
| 60 giây: 2–4 project có vai trò và kết quả | PASS một phần | Selected work có 5 project, thẻ có vai trò; kết quả một dòng chưa có |
| Project tiêu biểu khớp CV | **FAIL** | CV: LuxRoom, Nova, Sentry, VAS; site: Nova, Sentry, Flux, ACCESS, FlowCRM |
| Case study có khối metadata (vai trò, team, thời gian, bằng chứng) | PASS một phần | Nova có; chưa đồng nhất mọi case |
| Bằng chứng quy trình có AI hỗ trợ, kiểm tra được | PASS một phần | mục "How I work" + repo `uiux-ai-workspace`; chưa nói rõ người làm gì, AI làm gì |
| Tên repo / định danh công khai | **FAIL** | repo tên `DoAnhNghia_BAPortfolio` (BA) mâu thuẫn định vị designer |
| CV không lỗi chính tả | **FAIL** | "Expericence" ×2, "T ranslate", "S upported", "Information of Technology" |
| Link CV, live, source, contact chạy | PASS | kiểm 17 thẻ trên localhost, không ảnh lỗi |
| Mobile không tràn, không lỗi console | PASS | Playwright 390 px, 2026-11-20 |

## 5. Tham chiếu (đọc trực tiếp ngày 2026-11-20)

| Nguồn | Rút ra | Quyết định |
|---|---|---|
| karlkoch.me | chức danh + công ty là tiêu đề; 4 thẻ có loại, một dòng kết quả, một dòng vai trò; case mở bằng Team / Scope / Date | ADOPT cấu trúc thẻ và khối metadata |
| emilkowal.ski | dòng trạng thái hiện tại trung thực; case study dạng bài viết có đánh đổi rõ | ADAPT dòng trạng thái thành "Available for…" |
| brianlovin.com | câu giới thiệu có thành phố và công ty hiện tại | ADOPT địa điểm trong câu đầu |
| rauno.me | rất ít chữ, email copy một chạm | ADAPT nút copy email |
| ryo.lu | không đọc được (render phía client) | bỏ qua |

Không site nào nêu múi giờ hay hình thức làm việc: đây là khoảng trống mà ứng viên ở Việt Nam apply
global nên lấp (suy luận, chưa kiểm chứng với recruiter thật).

## 6. Giả định cần chủ portfolio xác nhận

1. Địa điểm: **Ho Chi Minh City, Vietnam (GMT+7)** — suy từ HCMUS, chưa xác nhận.
2. Hình thức: **remote toàn thời gian, có thể chồng giờ với châu Âu / APAC** — giả định.
3. Vai trò chính: **Product Designer** (CV đổi theo).
4. 4 project tiêu biểu.
5. Có giấy phép lao động / sẵn sàng relocation hay không — `UNKNOWN`, chưa đưa lên trang.
