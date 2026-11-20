# Nghiên cứu: chuyển động, bố cục và chi tiết UX cho portfolio

Ngày: 2026-11-20. Phạm vi: trang chủ và case study của portfolio Do Anh Nghia (đen trắng, tiêu đề serif,
collage nghiêng, hàng project lớn). Quy trình: `design-reference-research-and-benchmark` (ADOPT / ADAPT / REJECT).

## 1. Nguồn đã đọc

| Nguồn | Đã đọc | Giới hạn |
|---|---|---|
| `uiux-ai-workspace/foundations/motion.md` | toàn bộ | |
| `foundations/owner-picks.md` (9 website chủ repo chọn, số đo thật ở 1440×900) | toàn bộ | |
| `foundations/composition.md`, `motion-recipes/index.html` (R0–R8) | toàn bộ / danh sách công thức | chưa chạy thử từng công thức |
| `TASTE.md`, `CRAFT.md` | toàn bộ | |
| 21st.dev: trang chủ, `/community/components`, nhóm Texts, Heroes, Scroll Areas, Buttons, Navigation Menus | 7 trang, đọc trực tiếp | chỉ thấy tên, tác giả, lượt thích; **chưa mở trang chi tiết** nên chưa biết thời lượng, easing, có hỗ trợ giảm chuyển động hay không |

Portfolio hiện có: chuyển động rê chuột 150–240 ms, tắt khi giảm chuyển động; mục lục case study theo
`IntersectionObserver`. Chưa có hiệu ứng theo cuộn.

## 2. Nguyên tắc nền (workspace)

1. Mỗi chuyển động làm một trong bốn việc: **phản hồi, liên tục, trạng thái, chú ý**. Website thương hiệu được
   thêm chuyển động **kể chuyện theo cuộn**.
2. Hai nhịp không trộn:
   - **Kể chuyện:** 0,8–1,4 s, `cubic-bezier(.16,1,.3,1)` hoặc `(.165,.84,.44,1)`, trễ 60–100 ms giữa các dòng,
     bắt đầu khi khối qua 75–90% chiều cao màn. Hiệu ứng gắn cuộn chạy theo vị trí cuộn, không theo giờ.
   - **Thao tác:** 120 / 200 / 320 ms; rê chuột, gạch chân 0,3–0,4 s `cubic-bezier(.25,1,.5,1)`.
3. **Tối đa 3 loại hiệu ứng kể chuyện mỗi trang.** Một chỗ thật to, phần còn lại lùi về.
4. Chỉ animate `transform` và `opacity`; mở rộng chiều cao bằng `grid-template-rows: 0fr → 1fr`.
   Đóng nhanh hơn mở (70–80%).
5. Giảm chuyển động: hiện ngay trạng thái cuối, tắt mọi thứ tự chạy; tự chạy > 5 s phải có nút dừng (WCAG 2.2.2).
6. 6/9 trang mẫu dùng cuộn mượt (Lenis) khi có hiệu ứng theo cuộn.

## 3. 21st.dev đang phổ biến gì (quan sát)

- Phổ biến nhất (lượt thích hiển thị): "Scroll media expansion hero" 11,2k, "Container Scroll Animation" 10,7k,
  "Spline Scene" 9,8k, "Spotlight Card" 9,4k, "Radial Orbital Timeline" 7,7k, "Liquid Glass Button" 7,1k,
  "Scroll Morph Hero" 6,6k, "Motion Footer" 6,1k, "Parallax Scrolling" 6,1k.
- Kho lớn nhất: Buttons 2043, Cards 1780, Heroes 1152, Texts 663, Grids & Bento 620.
- Kiểu lặp nhiều nhất trong ~60 mục đầu mỗi nhóm: chữ hiện dần (blur, fade, cắt dọc) ~20; chữ chạy từng ký tự
  hoặc xáo chữ ~10; marquee ~9; nền gradient/glow ~7; kính mờ "liquid glass" ~6; ánh lấp lánh ~6; ảnh nở theo
  cuộn ~5; hero collage hoặc quạt ảnh 3; thẻ xếp chồng khi cuộn 2; header ẩn khi cuộn xuống.

## 4. Lọc cho portfolio

### Chuyển động kể chuyện (chọn đúng 3)

| # | Mẫu | Nguồn | Áp vào | Thông số | Quyết định |
|---|---|---|---|---|---|
| 1 | Chữ trồi từng dòng | workspace R1 (BCG); 21st "Vertical Cut Reveal", "Text Reveal" | "Complexity, / made clear." ở hero, tiêu đề case study | 0,9 s, trễ 80 ms/dòng, `cubic-bezier(.215,.61,.355,1)`, mặt nạ `overflow: clip` mỗi dòng; chạy một lần | **ADOPT** |
| 2 | Ảnh nở theo cuộn | workspace R2 (DOD, BCG); 21st "Scroll media expansion hero" (phổ biến nhất) | collage 4 hàng Selected work | `scale .92 → 1` và `clip-path: inset(6% → 0 round 8px)` theo tiến độ cuộn 0→1 của hàng | **ADAPT**: nhẹ hơn bản gốc tràn màn, giữ bố cục 2/3 |
| 3 | Hai tốc độ cuộn (chiều sâu) | workspace R5 (Jyuutaku); 21st "Parallax Scrolling" | ảnh bên trong khung collage trượt chậm hơn khung 6–8% | `translateY` theo cuộn, khung `overflow: hidden` | **ADAPT**: chỉ desktop, tắt trên màn chạm |

Thay thế nếu bỏ 3: R3 "đoạn tuyên bố sáng dần từng chữ" cho câu giới thiệu dưới hero (House of Yellow).

### Chuyển động thao tác

| Mẫu | Nguồn | Áp vào | Thông số | Quyết định |
|---|---|---|---|---|
| Gạch chân mọc ra | workspace R6 (Spyker) | link nav, "Case study", link trong bài | `scaleX 0→1`, origin trái, 0,35 s `cubic-bezier(.625,.05,0,1)`; rời chuột thu về bên phải | **ADOPT** |
| Ảnh phóng nhẹ + mũi tên nhích khi rê hàng project | 21st "Super Hover List", "Spotlight Card" (ý, không hiệu ứng đèn) | hàng Selected work, thẻ More projects | ảnh `scale 1.03`, mũi tên `translateX 4px`, 0,3 s; chỉ khi `(hover: hover)` | **ADAPT** (đã có scale 240 ms, chỉnh easing) |
| Header ẩn khi cuộn xuống, hiện khi cuộn lên | 21st "Scroll Direction: Hide Header" | case study dài | 200 ms `transform`; luôn hiện khi focus vào nav | **ADOPT** |
| Thanh tiến độ đọc + mục lục theo section | 21st "Dynamic Island TOC"; đã có observer | case study | thanh 2 px đầu trang, `scaleX` theo cuộn | **ADAPT** |
| Copy email một chạm, báo "Copied" | rauno.me (benchmark vòng trước) | contact, footer | đổi nhãn 1,5 s rồi trả về; `aria-live` | **ADOPT** |
| Cuộn mượt cho chuột | workspace R8 (Lenis) | chỉ khi bật hiệu ứng 2–3 | tắt khi giảm chuyển động, không áp cho bàn phím và màn chạm | **ADAPT** (tuỳ chọn) |

### Bố cục

| Mẫu | Nguồn | Áp vào | Quyết định |
|---|---|---|---|
| Hàng lệch 8/4 đổi bên | composition.md §1; 21st "Split Hero With Image Cards" | Selected work (đã có) | **ADOPT** (giữ) |
| Cột trái dính khi cuộn, nội dung bên phải | 21st "Sticky Content Wrapper"; rail metadata hiện có | case study: rail 6 trường dính tới hết phần mở đầu | **ADOPT** |
| Thẻ xếp chồng khi cuộn | 21st "Scroll Stacking Cards" | — | **REJECT**: che mất collage, chậm việc quét 4 project |
| Bento grid | 21st Grids & Bento | — | **REJECT** cho trang chủ (tranh vai với collage); có thể dùng cho mục kết quả trong case study |
| Timeline dọc cho kinh nghiệm | 21st "Timeline" | — | **REJECT**: danh sách phân cấp vừa làm đã đủ, timeline chỉ thêm trang trí |
| Cuộn ngang | 21st "Horizontal Scroll" | More projects trên mobile | **ADAPT** (tuỳ chọn), có `scroll-snap` và thấy mép thẻ kế |
| Marquee logo | 21st Marquees | — | **REJECT**: không có logo khách hàng thật, dựng ra là bịa |

### Loại hẳn (trái TASTE hoặc làm portfolio trông như mẫu AI)

Nền gradient, aurora, glow, ánh lấp lánh, viền chạy sáng, kính mờ "liquid glass", cảnh 3D Spline, chữ hạt,
quỹ đạo, chữ xáo trộn (khó đọc với recruiter), con trỏ đuổi theo chuột, nút "nam châm", màn chờ > 1,2 s.

## 5. Chi tiết UX tinh tế (không cần hiệu ứng)

1. **Back về đúng chỗ:** "← Selected work" trong case study nên trỏ `index.html#project-luxroom` (hàng vừa mở),
   không về đầu khu vực; FLOW.md "Back về ngữ cảnh vừa rời". Hiện tại trỏ `#work`.
2. **Chạy một lần:** hiệu ứng hiện khi cuộn chỉ chạy lần đầu; cuộn ngược không chạy lại.
3. **Không giữ chữ cần đọc ngay:** chữ ở màn đầu case study hiện trong ≤ 0,9 s; recruiter không phải chờ.
4. **Không nhảy bố cục:** ảnh luôn có `width`/`height` (đã có); hiệu ứng chỉ dùng `transform`, `clip-path`, `opacity`.
5. **Rê chuột chỉ khi có chuột:** bọc trong `@media (hover: hover) and (pointer: fine)`; màn chạm dùng trạng thái nhấn.
6. **Focus nhìn thấy:** `:focus-visible` cùng độ dày và màu với gạch chân rê chuột.
7. **Đóng nhanh hơn mở:** menu mobile mở 320 ms, đóng 240 ms.
8. **Giảm chuyển động có bản tĩnh:** mọi hiệu ứng có trạng thái cuối hiện ngay; kiểm bằng cách bật tuỳ chọn hệ điều hành.
9. **Kiểm ở 0,25×:** quay màn chậm để soát giật, chồng chéo; bấm liên tục 5 lần xem có khoá.

## 6. Mâu thuẫn cần chủ portfolio biết

`owner-picks.md` §2 và §6 ghi: một họ chữ mỗi trang, không chêm chữ nghiêng có chân vào tiêu đề ("font khác nhau",
"AI"). Portfolio đang dùng serif + nghiêng ("Complexity, *made clear.*") và chủ portfolio đã giữ nó ở vòng 2.
Hiệu ứng 1 (chữ trồi) làm câu này nổi hơn, nên cần quyết định trước: giữ ADN serif, hay theo gu một họ chữ.

## 7. Đề xuất triển khai

Đợt 1 (trang chủ): hiệu ứng 1, 2 + gạch chân + rê hàng project + copy email + Back về đúng hàng.
Đợt 2 (case study): rail dính, header ẩn khi cuộn, thanh tiến độ đọc, chữ trồi ở tiêu đề.
Mỗi đợt: bản giảm chuyển động, `taste-check`, quay 0,25× và ảnh trước/sau.
