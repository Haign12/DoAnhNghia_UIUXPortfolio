# Duyệt hướng thị giác

**Dự án:** Portfolio Do Anh Nghia, bản sẵn sàng apply công ty global
**Màn quyết định chính:** trang chủ (`index.html`)
**Việc chính của màn:** recruiter global biết trong 5 giây ai, vai trò gì, ở đâu, làm theo giờ nào; trong 60 giây mở được một case phù hợp.
**Người quyết định:** Do Anh Nghia (chủ portfolio)

## Các hướng

Bản dựng: `docs/redesign/global/directions/*.html`. Ảnh: `docs/redesign/global/shots/` (1280 px và 390 px, cùng nội dung thật).

| | Hướng A | Hướng B | Hướng C |
|---|---|---|---|
| Tên ngắn | Editorial evolution | Recruiter index | Case first |
| Ảnh chụp | `a-editorial-1280.png`, `a-editorial-390.png` | `b-index-1280.png`, `b-index-390.png` | `c-case-first-1280.png`, `c-case-first-390.png` |
| Thứ bậc: nhìn thấy gì đầu tiên | câu "Complexity, made clear." rồi bảng 5 thông tin recruiter (địa điểm, giờ làm, kinh nghiệm, học vấn, trạng thái) | tên và vai trò ở cột trái cố định; project đầu tiên đã hiện ở màn đầu | một câu định vị cụ thể, rồi ngay case Nova cỡ lớn với khối metadata |
| Mật độ | thoáng | gọn | vừa |
| Giọng thị giác | serif lớn có nghiêng, đen trắng, đường kẻ mảnh, lưới 2×2 bằng nhau | một họ sans, chữ đậm, hàng ngang ảnh và chữ, giống hồ sơ | sans cho thông điệp, serif chỉ ở tên project, một khối nền xám cho case nổi bật |
| ADN giữ / đổi / bỏ | giữ serif + nghiêng, đen trắng, đường kẻ, collage; sửa cỡ chữ nhỏ và " · " | **bỏ** serif và nghiêng (theo TASTE); giữ đen trắng, đường kẻ, collage | giữ serif ở tên project, bỏ câu "Complexity, made clear." và chữ nghiêng ở hero |
| Phục vụ việc chính thế nào | thông tin recruiter rõ nhất, có hàng giờ làm việc | quét nhanh nhất trên desktop, thông tin liên hệ luôn trong tầm mắt | cho thấy chiều sâu một case trước khi cuộn, đúng kiểu benchmark |
| Đánh đổi | trên mobile phải cuộn qua 5 dòng thông tin mới tới project | mất chất tạp chí, nhìn giống nhiều portfolio khác | chọn một project làm "đại diện"; ba project còn lại nhỏ hơn hẳn |
| Rủi ro, điều chưa chắc | 4 thẻ bằng nhau không nói project nào mạnh nhất | cột trái cố định chiếm 1/3 khung khi cuộn xuống | nếu Nova không hợp vị trí đang apply thì màn đầu lạc đề |

## Đề xuất

**Hướng đề xuất:** A (Editorial evolution), lấy thêm một phần của C.
**Lý do:** giữ trọn ADN (điều kiện bắt buộc của brownfield), câu định vị là điểm khác biệt nhận ra được, và bảng thông tin là thứ recruiter global cần nhất mà các portfolio benchmark đều thiếu.
**Lấy thêm từ hướng khác:** từ C, project đầu tiên là thẻ nổi bật nằm ngang kèm khối metadata (Role, Evidence, Scope, Type) thay vì lưới 2×2 bằng nhau; trên mobile thu bảng thông tin còn 3 dòng (địa điểm + giờ, trạng thái, học vấn) để project lên sớm hơn.

## Câu hỏi đi kèm (thông tin thật, không tự quyết)

1. Địa điểm và múi giờ có đúng là Ho Chi Minh City, GMT+7?
2. Trạng thái: chỉ remote, hay sẵn sàng relocation? Cần sponsor visa không?
3. 4 project tiêu biểu: Nova, Sentry, Flux, LuxRoom (khớp CV) có đồng ý không?
4. Vai trò chính thống nhất là "Product Designer" (CV sẽ đổi theo)?

## Quyết định

**Trạng thái:** `CẦN LÀM LẠI`
**Hướng được chọn:** không hướng nào
**Người chọn, ngày:** Do Anh Nghia, 2026-11-20
**Góp ý kèm theo:** "3 bản đều xấu". Đã chốt: địa điểm Ho Chi Minh City (GMT+7), open to remote, không nhắc relocation.
Selected work: LuxRoom, Flux, Atelier, Sentry (Nova ra khỏi nhóm tiêu biểu).

## Vòng 2 (2026-11-20)

Rút từ góp ý vòng 1 (cả bốn lý do được chủ portfolio chọn): nhạt như wireframe, bảng thông tin như
form, ảnh project quá nhỏ, kém hơn bản đang chạy. Vì vậy vòng 2 **tiến hoá trực tiếp trang hiện tại**,
không dựng bố cục mới:

- Selected work: LuxRoom, Flux, Atelier, Sentry; mỗi project một hàng lớn, collage chiếm 2/3, đổi bên
  xen kẽ, đánh số 01 / 04 theo ngôn ngữ chỉ mục của ADN.
- Thông tin global viết thành câu dưới hero: "Ho Chi Minh City, Vietnam (GMT+7). Open to remote roles."
- Học vấn Lyon 1 vào danh sách kinh nghiệm.
- Bỏ " · " trên thẻ (TASTE).
- Xoá 3 khối CSS `.selected-grid` cũ đã chết (không còn markup dùng).

Ảnh: `qa/global-after/`. **Trạng thái:** `ĐÃ DUYỆT` (Do Anh Nghia, 2026-11-20: "làm mục 1 2 3").
