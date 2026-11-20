# Bàn giao: portfolio sẵn sàng apply global (mục 1–3)

Ngày: 2026-11-20. Nhánh: `redesign/global-ready`. Chưa commit. Hướng trang chủ: vòng 2 `ĐÃ DUYỆT`.

## Đã làm

1. **Một chức danh:** "Product Designer" ở hero, ô Role của 11 case cá nhân, tiêu đề 18 trang case
   ("Product Design Case Study"), `og:description`, CV. Chức danh thật tại công ty cũ (UI/UX Designer) giữ nguyên.
2. **Khối mở đầu case:** LuxRoom, Flux, Atelier, Sentry cùng 6 trường Role, Users, Domain, Platform,
   Team, Year và nhãn "Selected work 0X / 04". Giá trị lấy từ chính trang case và CV.
   Xoá 32 ô "NOT EXPLICIT / NOT DOCUMENTED" khỏi mục Decision evidence snapshot ở 10 case (chủ portfolio chọn).
3. **CV:** `cv/main.typ` sửa theo mốc thời gian của PDF cũ (chủ portfolio xác nhận), giữ số liệu 8+ và 15+
   (xác nhận đúng), 4 project khớp Selected work, địa điểm kèm GMT+7, học vấn tách hai trường, sửa lỗi chính tả.
   Build: `typst compile --font-path cv/fonts cv/main.typ Do_Anh_Nghia_Product_Designer_CV.pdf` (Typst 0.15.1,
   Source Sans 3 TTF, OFL, `cv/fonts/OFL.txt`). Link Resume trỏ file mới; file tên cũ là bản sao để link cũ vẫn mở.
   Số liệu 8+ / 15+ cũng đưa vào Experience trên trang chủ.

Cùng đợt: dọn 52 quy tắc CSS chết (16 class không còn markup), bỏ " · " và overline trên thẻ, số đếm bộ lọc 12 px.

## Kiểm tra

| Mục | Kết quả | Bằng chứng |
|---|---|---|
| `overlay-check.py --base main` | PASS (0 lỗi) | CSS +104 / −229 trong `styles.css`, `!important` ròng 0 |
| `taste-check.cjs` 390/1280 sáng/tối | 7 lỗi còn lại, cả 7 là báo nhầm (dưới) | `taste/out3.txt` |
| axe-core | PASS ×4 | taste-check |
| Lỗi console, tràn ngang (Playwright 1440 / 390) | PASS | `qa/global-after/` |
| Link CV mới và cũ, 4 case | PASS (HTTP 200 trên localhost) | curl |
| Xoá CSS chết không đổi giao diện | PASS | 5/6 ảnh trùng từng pixel; trang chủ 1440 lệch ít hơn nhiễu giữa hai lần chụp cùng CSS |
| Test `qa/*.spec.mjs` | UNKNOWN | repo không có `@playwright/test`; spec đã cập nhật tên file CV |

Báo nhầm của taste-check, đã đo lại:
- "N card nổi bật trong một màn": checker coi ảnh collage nền tối (`a.index-media`) là card nền thương hiệu. Đây là ảnh project, không có chữ đè.
- "Tràn ngang 20px" ở 390 px: thanh lọc tràn mép có chủ đích (`margin-inline` âm + `padding-inline`), rộng đúng màn; `scrollTo(200,0)` cho `scrollX = 0`.
- "Chữ cách mép 0px" (cảnh báo): đo thật 20 px mỗi bên.

Cảnh báo "dòng giải thích phụ" dưới tên project được giữ: đó là mô tả project (nội dung chính của portfolio), không phải chú thích giao diện.

## Chưa làm / chưa kiểm

- Đổi tên repo `DoAnhNghia_BAPortfolio` (chủ repo làm trên GitHub).
- Kỹ năng "React and Next.js prototypes" trong CV: chưa đối chiếu source từng project (playbook yêu cầu bằng chứng) — `UNKNOWN`.
- Người dùng thật (recruiter) chưa xem; thiết bị thật, trình đọc màn hình chưa kiểm.
- Bản thử `docs/redesign/global/directions/` (vòng 1, bị loại) giữ làm hồ sơ; có thể xoá trước khi merge.

## Đợt 1 chuyển động (2026-11-20)

Theo `research-motion-layout-ux.md` §7. Kể chuyện: 2 loại trên trang chủ (chữ trồi + khối hiện, collage nở theo cuộn).

| Hạng mục | Cách làm | Kiểm tra |
|---|---|---|
| Chữ trồi từng dòng ở hero (R1) | markup `.line` trong `h1`, CSS 900 ms `cubic-bezier(.215,.61,.355,1)`, trễ 80 ms; mặt nạ chỉ cắt dọc | PASS: kết thúc `transform: none`; không tràn ngang |
| Đoạn giới thiệu + nút hiện sau 240 ms | `block-rise` 900 ms | PASS |
| Collage nở theo cuộn (R2) | `animation-timeline: view()`, `scale .92→1` + `clip-path inset 6%→0`, `entry 10% → cover 40%`; trình duyệt chưa hỗ trợ thấy trạng thái cuối | PASS: 0,92 ở 95% màn → 1 ở 40% |
| Gạch chân mọc ra (R6) | nền 1 px `background-size 0→100%`, 350 ms; cả `:focus-visible` | PASS |
| Rê collage | `scale 1.03`, 300 ms `cubic-bezier(.25,1,.5,1)`, chỉ `(hover: hover)` | PASS |
| Copy email | nút trong markup, hiện khi có Clipboard API; "Copied" 1,5 s; `role=status` | PASS: clipboard đúng địa chỉ |
| Back về đúng hàng | `id="project-<slug>"` trên 17 thẻ; 17 case trỏ `index.html#project-<slug>`; căn lại sau khi tải, dừng khi người dùng cuộn | PASS: desktop 104 px, mobile 100 px dưới đỉnh (bằng `scroll-padding-top`) |
| Giảm chuyển động | mọi hiệu ứng trong `prefers-reduced-motion: no-preference` | PASS: `animation-name: none`, trạng thái cuối |

Sửa kèm: bỏ 4 `scroll-margin-top` cộng dồn với `scroll-padding-top` của trang (link Experience trước đây dừng thấp hơn ~100 px).
`overlay-check`: 0 lỗi (CSS +220 / −256). `taste-check`: 7 lỗi báo nhầm như trước, axe PASS ×4.
Chưa kiểm: Safari và Firefox thật (Firefox chưa hỗ trợ `view()` nên không có hiệu ứng nở, đã có trạng thái cuối), quay 0,25×.

## Đợt 2 chuyển động: case study (2026-11-20)

Sửa tại `case-study.css` và `case-study.js` (dùng chung cho 20 trang case; giữ CRLF của hai file).

| Hạng mục | Cách làm | Kiểm tra |
|---|---|---|
| Tiêu đề section dính khi đọc (Sticky Content Wrapper) | `.case-section-head` `position: sticky; top: 104px; align-self: start`; ≤ 800 px trở lại `static` | PASS: Sentry section dài 1712 px, tiêu đề đứng ở 104 px |
| Header ẩn khi cuộn xuống | `case-study.js` bật `.is-hidden` khi xuống > 160 px (ngưỡng rung 6 px); 180 ms ẩn, 240 ms hiện; `:focus-within` luôn hiện | PASS: ẩn khi cuộn xuống, hiện khi cuộn lên, hiện khi focus bàn phím |
| Thanh tiến độ đọc | `body::before` cố định 2 px, `animation-timeline: scroll(root)`; chỉ khi trình duyệt hỗ trợ | PASS: scaleX 0,56 ở 56% trang |
| Tiêu đề + câu dẫn hiện ra | `case-rise` 900 ms, câu dẫn trễ 120 ms | PASS; giảm chuyển động: `animation-name: none` |

20 trang × 1440 và 390: không lỗi console, không tràn ngang.
Chưa kiểm: Safari, Firefox (Firefox chưa có `scroll()` timeline nên không có thanh tiến độ).

## Bỏ khối "Project summary" (2026-11-20, chủ portfolio chọn)

- `case-study.js`: xoá bảng `recruiterProofByPage` và phần chèn khối `#project-30-sec-proof` (12 case). Link
  "Evidence details ↓" giữ lại, nay gắn cho mọi trang có `.case-evidence-details` (14 trang).
- Xoá `case-recruiter-proof.css` (chỉ khối này dùng).
- Test khoá giao diện đã đổi, có lý do ghi trong file:
  - `qa/portfolio-v5.spec.mjs`: test "30-second proof strip" thành test "không còn khối chèn, có link tới phần bằng chứng".
  - `qa/figma-cta-hierarchy.spec.mjs`: số ô snapshot từ "đúng 11" thành "≥ 5" (các ô NOT … đã xoá trước đó; test này
    lẽ ra phải đổi cùng lúc với việc xoá ô); bỏ kiểm khối proof; deep link dùng `#case-evidence`.
- Kiểm: 20 trang không còn khối, không lỗi console; bấm "Evidence details ↓" mở đúng phần. Nova giữ đoạn "Retest the
  revised prototype" vì đó là nghiên cứu vòng 2 có người tham gia thật.
- Test Playwright của repo vẫn chưa chạy được (thiếu `@playwright/test`): `UNKNOWN`.

## Sự cố: scratchpad bị xoá (2026-11-20)

Thư mục tạm của phiên bị dọn. Mất các bản backup: 34 thumbnail gốc trong `assets/images/thumbs/` (chưa từng commit,
không khôi phục được từ git); CV cũ và 2 ảnh FlowCRM cũ vẫn lấy lại được từ nhánh `main`. Bộ thumbnail cũ hơn
vẫn còn trong `assets/images/selected/`.

## Độ nét ảnh (2026-11-20)

Nguyên nhân: ảnh chụp ở 1x, thumbnail xuất tối đa 1440 px, `sizes` cũ ghi `400px` nên màn 1x tải bản 720 cho khung 815 px;
ảnh case study 390–1440 px hiển thị tới 1238 px (cần 2476 px trên màn 2x).

Đã làm:
- 17 thumbnail chụp lại từ bản live ở 2x (khung nguồn 2880×1800), ghép collage ở 2x, xuất 960/1440/2160/2880 webp q90.
  `srcset` 4 bề rộng; `sizes`: Selected work `(max-width: 839px) calc(100vw - 40px), min(60vw, 860px)`,
  More projects `(max-width: 599px) calc(100vw - 40px), (max-width: 1100px) calc(50vw - 40px), 420px`. Xoá 17 file 720 cũ.
- 22 ảnh case study chụp lại ở 2x (mobile 3x, panel Sentry 4x, CareFlow bệnh nhân 5x vì hiển thị 816 px trên desktop);
  `capital.png`, `lava-amenities.png`, `voltis.png` đổi sang webp; width/height cập nhật theo khung mới.
- Ảnh bìa thay nội dung (bản gốc không đủ độ phân giải): `capital-place.jpg` (ảnh hội trường 1024 px → trang chủ Capital
  Place 2x), Violet (ảnh sản phẩm 1200 px → trang sản phẩm Violette 03 2x, `violet-product.jpg`), `voltis.webp` (collage mới).
- Ảnh ngoài: Unsplash `w=2880`, Pexels `w=2400`, Tesla `w_2880`. Violet `editorial-04.jpg` (1600 px) giới hạn hiển thị 800 px.

Kiểm (`qa/sharpness-audit.cjs`, kết quả `qa/sharpness-after.json`): 170 lần hiển thị ở 1440@1x, 1440@2x, 390@3x.
Trước: 52 lần bị phóng to trên 38 file. Sau: 2, cùng một nguyên nhân:
- `nova-transfer-review-round01.jpg`, `round02.jpg` (740 px) trên điện thoại 3x cần 1020 px (mật độ thực 2,2×). Đây là
  ảnh bằng chứng của các vòng thử nghiệm cũ; repo Nova không giữ bản gốc lớn hơn; chụp lại từ bản hiện tại sẽ sai bằng chứng.
  Desktop 1x và 2x đạt.
Quy tắc từ nay: chụp ≥ 2x, xuất nhiều bề rộng, chạy `qa/sharpness-audit.cjs` trước khi giao; tỉ lệ < 1 là lỗi chặn (trừ SVG).
