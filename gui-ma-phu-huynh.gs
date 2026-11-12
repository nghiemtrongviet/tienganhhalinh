/**
 * Gửi mã kích hoạt "cho con học tiếp" vào hộp thư của bố mẹ.
 * Chạy trong Google Apps Script bằng chính tài khoản Google của bố mẹ:
 * thư được gửi tới địa chỉ của người triển khai script, nên không cần ghi địa chỉ thư ở đâu cả.
 *
 * Triển khai: Deploy > New deployment > Web app
 *   Execute as: Me        Who has access: Anyone
 * rồi dán "Web app URL" vào hằng MAIL_URL trong app.js.
 */
var MAX_PER_DAY = 10; // tối đa số thư mỗi ngày, phòng khi có người bấm liên tục

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var code = String(d.code || "");
    if (!/^\d{6}$/.test(code)) return out({ ok: false, error: "bad" });
    var kid = String(d.kid || "Con").replace(/[^\p{L}\p{N} ]/gu, "").slice(0, 30) || "Con";
    var minutes = Math.min(60, Math.max(1, parseInt(d.minutes, 10) || 15));
    var ttl = Math.min(60, Math.max(1, parseInt(d.ttl, 10) || 15));

    var props = PropertiesService.getScriptProperties();
    var day = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "yyyy-MM-dd");
    var n = props.getProperty("day") === day ? parseInt(props.getProperty("n"), 10) || 0 : 0;
    if (n >= MAX_PER_DAY) return out({ ok: false, error: "limit" });
    props.setProperties({ day: day, n: String(n + 1) });

    MailApp.sendEmail({
      to: Session.getEffectiveUser().getEmail(),
      subject: "Mã cho " + kid + " học tiếp: " + code,
      body: kid + " đã học đủ " + minutes + " phút tiếng Anh hôm nay và đang xin học thêm " + minutes + " phút.\n\n" +
        "Mã kích hoạt: " + code + "\n\n" +
        "Nếu đồng ý, bố mẹ đọc mã này cho con nhập vào trang. Mã có hiệu lực trong " + ttl + " phút.\n" +
        "Nếu không đồng ý, bố mẹ chỉ cần bỏ qua thư này.\n\n" +
        "(Lần xin thứ " + (n + 1) + " trong ngày, tối đa " + MAX_PER_DAY + " lần.)"
    });
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: "error" });
  }
}

function doGet() { return out({ ok: true, info: "Dịch vụ gửi mã đang chạy." }); }

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
