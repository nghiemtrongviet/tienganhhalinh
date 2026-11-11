// Nội dung luyện tập tự biên soạn, bám theo chủ đề từng unit của giáo trình Business Partner A1.
// vocab: [từ, phiên âm, nghĩa, câu ví dụ]
// phrases: [câu tiếng Anh, nghĩa tiếng Việt]  -> dùng cho chép chính tả + luyện nói
// dialogue.lines: [vai, câu]
// dialogue.questions: [câu hỏi, [đáp án...], chỉ số đáp án đúng]
// videos: [YouTube ID, nhãn]
window.COURSE = [
  {
    id: 1, title: "Welcome", vi: "Chào hỏi & giới thiệu",
    topics: "Giới thiệu bản thân · Quốc gia, quốc tịch · Thông tin cá nhân · Đón khách đến công ty",
    videos: [
      ["ztc584PeFqk", "Bài giảng Unit 1"],
      ["dDxKBJkRZFU", "1.1.1 What's your name?"],
      ["rqcd_jp1eTI", "1.4.1 Welcoming a visitor"],
      ["YK3DudUP4RE", "1.4.2 Welcoming a visitor"]
    ],
    vocab: [
      ["name", "/neɪm/", "tên", "My name is Lan."],
      ["country", "/ˈkʌntri/", "quốc gia, đất nước", "Vietnam is a beautiful country."],
      ["nationality", "/ˌnæʃəˈnæləti/", "quốc tịch", "What is your nationality?"],
      ["Vietnamese", "/ˌvjetnəˈmiːz/", "người Việt Nam; tiếng Việt", "I am Vietnamese."],
      ["colleague", "/ˈkɒliːɡ/", "đồng nghiệp", "This is my colleague, Minh."],
      ["manager", "/ˈmænɪdʒə/", "quản lý, trưởng phòng", "She is the sales manager."],
      ["company", "/ˈkʌmpəni/", "công ty", "Our company is in Hanoi."],
      ["office", "/ˈɒfɪs/", "văn phòng", "The office is on the second floor."],
      ["department", "/dɪˈpɑːtmənt/", "phòng ban", "I work in the IT department."],
      ["reception", "/rɪˈsepʃn/", "quầy lễ tân", "Please wait at reception."],
      ["visitor", "/ˈvɪzɪtə/", "khách đến thăm", "We have a visitor from Japan today."],
      ["first name", "/ˈfɜːst neɪm/", "tên (tên gọi)", "My first name is Viet."],
      ["surname", "/ˈsɜːneɪm/", "họ", "Can you spell your surname, please?"],
      ["address", "/əˈdres/", "địa chỉ", "What is your email address?"],
      ["phone number", "/ˈfəʊn ˌnʌmbə/", "số điện thoại", "My phone number is on the card."],
      ["job title", "/ˈdʒɒb ˌtaɪtl/", "chức danh", "Her job title is project engineer."],
      ["meeting room", "/ˈmiːtɪŋ ruːm/", "phòng họp", "The meeting room is next to the kitchen."],
      ["factory", "/ˈfæktri/", "nhà máy", "The company has a factory in Da Nang."],
      ["Japan", "/dʒəˈpæn/", "nước Nhật Bản", "Our partner is from Japan."],
      ["German", "/ˈdʒɜːmən/", "người Đức; tiếng Đức", "Mr Braun is German."],
      ["British", "/ˈbrɪtɪʃ/", "thuộc nước Anh, người Anh", "She works for a British company."],
      ["American", "/əˈmerɪkən/", "người Mỹ; thuộc nước Mỹ", "Our new manager is American."],
      ["spell", "/spel/", "đánh vần", "How do you spell your name?"],
      ["floor", "/flɔː/", "tầng (của tòa nhà)", "Sales is on the third floor."],
      ["building", "/ˈbɪldɪŋ/", "tòa nhà", "Our office is in a new building."],
      ["canteen", "/kænˈtiːn/", "nhà ăn, căng tin", "We have lunch in the canteen."],
      ["car park", "/ˈkɑː pɑːk/", "bãi đỗ xe", "The car park is behind the building."],
      ["lift", "/lɪft/", "thang máy", "Take the lift to the fifth floor."],
      ["receptionist", "/rɪˈsepʃənɪst/", "nhân viên lễ tân", "The receptionist can help you."],
      ["badge", "/bædʒ/", "thẻ đeo, phù hiệu", "Here is your visitor badge."]
    ],
    phrases: [
      ["Hello, my name is Anna.", "Xin chào, tên tôi là Anna."],
      ["Nice to meet you.", "Rất vui được gặp bạn."],
      ["Where are you from?", "Bạn đến từ đâu?"],
      ["I am from Vietnam.", "Tôi đến từ Việt Nam."],
      ["This is my colleague, Tom.", "Đây là đồng nghiệp của tôi, Tom."],
      ["Can you spell your surname, please?", "Bạn đánh vần họ của bạn được không?"],
      ["What is your phone number?", "Số điện thoại của bạn là gì?"],
      ["Welcome to our company.", "Chào mừng bạn đến với công ty chúng tôi."],
      ["Please take a seat.", "Mời bạn ngồi."],
      ["Would you like some coffee?", "Bạn có muốn uống cà phê không?"]
    ],
    dialogue: {
      title: "Đón khách ở quầy lễ tân",
      lines: [
        ["A", "Good morning. Welcome to Green Energy."],
        ["B", "Good morning. My name is David Lee. I am here to see Ms Hoa."],
        ["A", "Nice to meet you, Mr Lee. Can you spell your surname, please?"],
        ["B", "Yes, it is L, E, E."],
        ["A", "Thank you. Please take a seat. Would you like some tea?"],
        ["B", "Yes, please. Thank you very much."],
        ["A", "Ms Hoa is in the meeting room. She can see you in five minutes."]
      ],
      questions: [
        ["What is the visitor's name?", ["David Lee", "Tom Green", "Mr Hoa"], 0],
        ["Who is he here to see?", ["The receptionist", "Ms Hoa", "Mr Green"], 1],
        ["What drink does he want?", ["Coffee", "Water", "Tea"], 2]
      ]
    }
  },
  {
    id: 2, title: "Work", vi: "Công việc",
    topics: "Nghề nghiệp, phòng ban · Công ty làm gì · Thói quen hằng ngày · Small talk",
    videos: [
      ["lqKe4zp2meU", "Bài giảng Unit 2"],
      ["K619WEn383g", "2.1.1 I work in Sales"],
      ["GADxb3WVAcE", "2.4.1 Small talk at work"]
    ],
    vocab: [
      ["work", "/wɜːk/", "làm việc; công việc", "I work for a power company."],
      ["job", "/dʒɒb/", "công việc, nghề", "I like my job."],
      ["engineer", "/ˌendʒɪˈnɪə/", "kỹ sư", "He is an electrical engineer."],
      ["accountant", "/əˈkaʊntənt/", "kế toán viên", "The accountant checks the invoices."],
      ["sales", "/seɪlz/", "kinh doanh, bán hàng", "She works in Sales."],
      ["marketing", "/ˈmɑːkɪtɪŋ/", "tiếp thị", "The marketing team makes the adverts."],
      ["human resources", "/ˌhjuːmən rɪˈzɔːsɪz/", "nhân sự", "Human Resources helps new employees."],
      ["customer", "/ˈkʌstəmə/", "khách hàng", "We have customers in ten countries."],
      ["product", "/ˈprɒdʌkt/", "sản phẩm", "Our main product is solar panels."],
      ["service", "/ˈsɜːvɪs/", "dịch vụ", "The company sells products and services."],
      ["employee", "/ɪmˈplɔɪiː/", "nhân viên", "The company has two hundred employees."],
      ["produce", "/prəˈdjuːs/", "sản xuất", "They produce cars in Germany."],
      ["sell", "/sel/", "bán", "We sell machines to factories."],
      ["team", "/tiːm/", "nhóm, đội", "There are six people in my team."],
      ["start work", "/stɑːt wɜːk/", "bắt đầu làm việc", "I start work at eight o'clock."],
      ["finish", "/ˈfɪnɪʃ/", "kết thúc, xong", "We finish at half past five."],
      ["usually", "/ˈjuːʒuəli/", "thường thường", "I usually have lunch at twelve."],
      ["weekend", "/ˌwiːkˈend/", "cuối tuần", "How was your weekend?"],
      ["technician", "/tekˈnɪʃn/", "kỹ thuật viên", "The technician repairs the machines."],
      ["designer", "/dɪˈzaɪnə/", "nhà thiết kế", "He is a designer in our team."],
      ["finance", "/ˈfaɪnæns/", "tài chính", "She works in Finance."],
      ["client", "/ˈklaɪənt/", "khách hàng (dịch vụ)", "I have a meeting with a client."],
      ["buy", "/baɪ/", "mua", "We buy parts from China."],
      ["design", "/dɪˈzaɪn/", "thiết kế", "They design power plants."],
      ["travel", "/ˈtrævl/", "đi lại, đi công tác", "I travel to Ho Chi Minh City every month."],
      ["lunch break", "/ˈlʌntʃ breɪk/", "giờ nghỉ trưa", "My lunch break is at twelve."],
      ["always", "/ˈɔːlweɪz/", "luôn luôn", "I always check my emails in the morning."],
      ["sometimes", "/ˈsʌmtaɪmz/", "thỉnh thoảng", "I sometimes work at home."],
      ["hundred", "/ˈhʌndrəd/", "một trăm", "We have three hundred customers."],
      ["conference", "/ˈkɒnfərəns/", "hội nghị", "I am at a conference this week."]
    ],
    phrases: [
      ["What do you do?", "Bạn làm nghề gì?"],
      ["I am an engineer.", "Tôi là kỹ sư."],
      ["I work in the sales department.", "Tôi làm ở phòng kinh doanh."],
      ["Our company produces solar panels.", "Công ty chúng tôi sản xuất pin mặt trời."],
      ["I start work at eight o'clock.", "Tôi bắt đầu làm việc lúc tám giờ."],
      ["We have a meeting every Monday.", "Chúng tôi họp mỗi thứ Hai."],
      ["Do you travel for work?", "Bạn có đi công tác không?"],
      ["How was your weekend?", "Cuối tuần của bạn thế nào?"],
      ["It was great, thanks.", "Rất tuyệt, cảm ơn."],
      ["See you later.", "Hẹn gặp lại sau."]
    ],
    dialogue: {
      title: "Làm quen ở hội nghị",
      lines: [
        ["A", "Hi, I am Mai. What do you do?"],
        ["B", "Hello, Mai. I am Paul. I am a project manager at a construction company."],
        ["A", "That is interesting. Where do you work?"],
        ["B", "I work in Singapore, but I travel a lot. And you?"],
        ["A", "I work in Sales for a software company in Hanoi."],
        ["B", "Do you like your job?"],
        ["A", "Yes, I do. I meet new customers every week."]
      ],
      questions: [
        ["What is Paul's job?", ["Sales manager", "Project manager", "Engineer"], 1],
        ["Where does Mai work?", ["Hanoi", "Singapore", "Bangkok"], 0],
        ["What does Mai do every week?", ["She travels", "She writes software", "She meets new customers"], 2]
      ]
    }
  },
  {
    id: 3, title: "What? When? Where?", vi: "Thời gian & yêu cầu",
    topics: "Tháng, mùa, ngày tháng · can / can't · Đưa ra yêu cầu · Họp tiến độ",
    videos: [
      ["Oggnsla_gzY", "3.1.1 I can work flexible hours"],
      ["J2Mpq3OGP94", "3.4.1 A progress meeting"]
    ],
    vocab: [
      ["January", "/ˈdʒænjuəri/", "tháng Một", "The project starts in January."],
      ["December", "/dɪˈsembə/", "tháng Mười hai", "We are very busy in December."],
      ["spring", "/sprɪŋ/", "mùa xuân", "The conference is in spring."],
      ["summer", "/ˈsʌmə/", "mùa hè", "Many people take a holiday in summer."],
      ["autumn", "/ˈɔːtəm/", "mùa thu", "Sales are high in autumn."],
      ["winter", "/ˈwɪntə/", "mùa đông", "It is cold here in winter."],
      ["busy", "/ˈbɪzi/", "bận rộn", "I am busy this afternoon."],
      ["flexible hours", "/ˌfleksəbl ˈaʊəz/", "giờ làm việc linh hoạt", "I can work flexible hours."],
      ["first", "/fɜːst/", "thứ nhất, mùng một", "The meeting is on the first of May."],
      ["second", "/ˈsekənd/", "thứ hai, mùng hai", "My office is on the second floor."],
      ["third", "/θɜːd/", "thứ ba, mùng ba", "The deadline is the third of June."],
      ["date", "/deɪt/", "ngày tháng", "What is the date today?"],
      ["deadline", "/ˈdedlaɪn/", "hạn chót", "The deadline is next Friday."],
      ["time off", "/ˌtaɪm ˈɒf/", "thời gian nghỉ phép", "Can I have some time off next week?"],
      ["holiday", "/ˈhɒlədeɪ/", "kỳ nghỉ", "I am on holiday in August."],
      ["request", "/rɪˈkwest/", "yêu cầu, đề nghị", "I have a request for the manager."],
      ["complaint", "/kəmˈpleɪnt/", "lời phàn nàn, khiếu nại", "We have a complaint from a customer."],
      ["progress", "/ˈprəʊɡres/", "tiến độ", "Let us talk about the progress of the project."],
      ["month", "/mʌnθ/", "tháng", "We have a team meeting every month."],
      ["season", "/ˈsiːzn/", "mùa", "Summer is our busy season."],
      ["year", "/jɪə/", "năm", "The project takes one year."],
      ["calendar", "/ˈkælɪndə/", "lịch", "Please check the calendar."],
      ["fourth", "/fɔːθ/", "thứ tư, mùng bốn", "The training is on the fourth of April."],
      ["fifth", "/fɪfθ/", "thứ năm, mùng năm", "My birthday is on the fifth of March."],
      ["twentieth", "/ˈtwentiəθ/", "thứ hai mươi, ngày hai mươi", "We pay salaries on the twentieth."],
      ["next week", "/ˌnekst ˈwiːk/", "tuần sau", "I am in Da Nang next week."],
      ["borrow", "/ˈbɒrəʊ/", "mượn", "Can I borrow your pen?"],
      ["help", "/help/", "giúp đỡ", "Could you help me with this report?"],
      ["urgent", "/ˈɜːdʒənt/", "khẩn cấp, gấp", "This request is urgent."],
      ["report", "/rɪˈpɔːt/", "báo cáo", "The report is ready."]
    ],
    phrases: [
      ["I can work flexible hours.", "Tôi có thể làm giờ linh hoạt."],
      ["I can't come on Friday.", "Tôi không thể đến vào thứ Sáu."],
      ["We are very busy in December.", "Chúng tôi rất bận vào tháng Mười hai."],
      ["The meeting is on the third of May.", "Cuộc họp vào ngày mùng ba tháng Năm."],
      ["Can I have some time off?", "Tôi xin nghỉ phép được không?"],
      ["Could you send me the report?", "Bạn gửi cho tôi bản báo cáo được không?"],
      ["Yes, of course.", "Vâng, tất nhiên rồi."],
      ["Sorry, I am afraid I can't.", "Xin lỗi, tôi e là không thể."],
      ["When is the deadline?", "Hạn chót là khi nào?"],
      ["The office is open from nine to five.", "Văn phòng mở cửa từ chín giờ đến năm giờ."]
    ],
    dialogue: {
      title: "Xin nghỉ phép",
      lines: [
        ["A", "Excuse me, Ms Kim. Can I ask you something?"],
        ["B", "Yes, of course. What is it?"],
        ["A", "Can I have some time off in July?"],
        ["B", "When in July?"],
        ["A", "From the tenth to the fourteenth."],
        ["B", "Let me check. Sorry, we are very busy on the tenth. Could you start on the eleventh?"],
        ["A", "Yes, I can. Thank you very much."]
      ],
      questions: [
        ["What does the employee want?", ["A new computer", "Time off", "A meeting"], 1],
        ["Which month is it?", ["July", "June", "January"], 0],
        ["When can the time off start?", ["The tenth", "The fourteenth", "The eleventh"], 2]
      ]
    }
  },
  {
    id: 4, title: "Problems and solutions", vi: "Vấn đề & giải pháp",
    topics: "Quá khứ đơn · Sự cố trong công việc · Gọi điện thoại · Xử lý khiếu nại",
    videos: [
      ["nPiXNgw7E_Q", "4.1.1 Problems at work"],
      ["2k55ZFVhTwQ", "4.4.1 There is a problem with ..."],
      ["l81QT9pW13Y", "4.4.2 There is a problem with ..."]
    ],
    vocab: [
      ["problem", "/ˈprɒbləm/", "vấn đề, sự cố", "There is a problem with the printer."],
      ["solution", "/səˈluːʃn/", "giải pháp", "We need a solution today."],
      ["went", "/went/", "đã đi (quá khứ của go)", "What went wrong?"],
      ["had", "/hæd/", "đã có (quá khứ của have)", "We had a problem yesterday."],
      ["sent", "/sent/", "đã gửi (quá khứ của send)", "I sent the email last night."],
      ["broke", "/brəʊk/", "đã hỏng, đã vỡ (quá khứ của break)", "The machine broke this morning."],
      ["late", "/leɪt/", "muộn, trễ", "The delivery was late."],
      ["delivery", "/dɪˈlɪvəri/", "việc giao hàng", "The delivery arrived on Monday."],
      ["order", "/ˈɔːdə/", "đơn hàng; đặt hàng", "There is a mistake in my order."],
      ["mistake", "/mɪˈsteɪk/", "lỗi, sai sót", "Sorry, we made a mistake."],
      ["wrong", "/rɒŋ/", "sai, nhầm", "You sent the wrong product."],
      ["fix", "/fɪks/", "sửa chữa", "The technician fixed the computer."],
      ["call back", "/ˌkɔːl ˈbæk/", "gọi lại", "I will call you back in ten minutes."],
      ["apologise", "/əˈpɒlədʒaɪz/", "xin lỗi", "We apologise for the delay."],
      ["delay", "/dɪˈleɪ/", "sự chậm trễ", "There was a delay at the port."],
      ["refund", "/ˈriːfʌnd/", "khoản hoàn tiền", "Can I have a refund, please?"],
      ["replace", "/rɪˈpleɪs/", "thay thế", "We will replace the broken part."],
      ["check", "/tʃek/", "kiểm tra", "I will check and call you back."],
      ["bought", "/bɔːt/", "đã mua (quá khứ của buy)", "We bought a new printer last week."],
      ["made", "/meɪd/", "đã làm, đã tạo (quá khứ của make)", "I made a mistake in the report."],
      ["got", "/ɡɒt/", "đã nhận, đã có (quá khứ của get)", "I got your email this morning."],
      ["lost", "/lɒst/", "đã mất, làm mất (quá khứ của lose)", "They lost my order."],
      ["forgot", "/fəˈɡɒt/", "đã quên (quá khứ của forget)", "I forgot my password."],
      ["damaged", "/ˈdæmɪdʒd/", "bị hư hỏng", "The box was damaged."],
      ["missing", "/ˈmɪsɪŋ/", "bị thiếu, thất lạc", "Two items are missing."],
      ["receive", "/rɪˈsiːv/", "nhận được", "Did you receive my message?"],
      ["customer service", "/ˌkʌstəmə ˈsɜːvɪs/", "bộ phận chăm sóc khách hàng", "Please call customer service."],
      ["hold on", "/ˌhəʊld ˈɒn/", "giữ máy, chờ một chút", "Hold on, please."],
      ["leave a message", "/ˌliːv ə ˈmesɪdʒ/", "để lại lời nhắn", "Can I leave a message?"],
      ["promise", "/ˈprɒmɪs/", "hứa; lời hứa", "I promise I will call you today."]
    ],
    phrases: [
      ["What went wrong?", "Đã xảy ra chuyện gì vậy?"],
      ["We had a problem with the delivery.", "Chúng tôi gặp sự cố với việc giao hàng."],
      ["The order arrived late.", "Đơn hàng đến muộn."],
      ["I am sorry about that.", "Tôi xin lỗi về việc đó."],
      ["How can I help you?", "Tôi có thể giúp gì cho bạn?"],
      ["I will check and call you back.", "Tôi sẽ kiểm tra và gọi lại cho bạn."],
      ["We will send a new one today.", "Chúng tôi sẽ gửi cái mới trong hôm nay."],
      ["Can I speak to the manager, please?", "Cho tôi nói chuyện với quản lý được không?"],
      ["We did not receive the invoice.", "Chúng tôi chưa nhận được hóa đơn."],
      ["Thank you for your help.", "Cảm ơn sự giúp đỡ của bạn."]
    ],
    dialogue: {
      title: "Khiếu nại qua điện thoại",
      lines: [
        ["A", "Good afternoon, customer service. How can I help you?"],
        ["B", "Hello. There is a problem with my order."],
        ["A", "I am sorry about that. What is the problem?"],
        ["B", "I ordered ten laptops, but I received only eight."],
        ["A", "I see. Can I have your order number, please?"],
        ["B", "Yes, it is four, five, two, nine."],
        ["A", "Thank you. We will send two more laptops tomorrow."]
      ],
      questions: [
        ["How many laptops did the customer order?", ["Eight", "Ten", "Two"], 1],
        ["How many did the customer receive?", ["Eight", "Ten", "Nine"], 0],
        ["When will the company send the rest?", ["Today", "Next week", "Tomorrow"], 2]
      ]
    }
  },
  {
    id: 5, title: "Office day to day", vi: "Việc văn phòng hằng ngày",
    topics: "Hiện tại tiếp diễn · Cụm động từ – danh từ · Sắp xếp cuộc họp · Nhờ giúp đỡ",
    videos: [
      ["iFdpJNbn0qA", "5.1.1 What are they doing?"],
      ["WDJFlu5DEVw", "5.4.1 Can you help me?"]
    ],
    vocab: [
      ["write a report", "/ˌraɪt ə rɪˈpɔːt/", "viết báo cáo", "I am writing a report at the moment."],
      ["send an email", "/ˌsend ən ˈiːmeɪl/", "gửi email", "She is sending an email to the client."],
      ["make a phone call", "/ˌmeɪk ə ˈfəʊn kɔːl/", "gọi điện thoại", "He is making a phone call."],
      ["have a meeting", "/ˌhæv ə ˈmiːtɪŋ/", "họp", "They are having a meeting now."],
      ["give a presentation", "/ˌɡɪv ə ˌpreznˈteɪʃn/", "thuyết trình", "I am giving a presentation tomorrow."],
      ["meet a client", "/ˌmiːt ə ˈklaɪənt/", "gặp khách hàng", "We are meeting a client at three."],
      ["schedule", "/ˈʃedjuːl/", "lịch trình, lịch làm việc", "My schedule is full today."],
      ["arrange", "/əˈreɪndʒ/", "sắp xếp", "Can we arrange a meeting?"],
      ["postpone", "/pəʊstˈpəʊn/", "hoãn lại", "We need to postpone the meeting."],
      ["cancel", "/ˈkænsl/", "hủy bỏ", "They cancelled the training."],
      ["free", "/friː/", "rảnh rỗi", "Are you free at two?"],
      ["available", "/əˈveɪləbl/", "có thể tham gia, rảnh", "I am not available on Monday."],
      ["discuss", "/dɪˈskʌs/", "thảo luận", "Can we meet to discuss the budget?"],
      ["favour", "/ˈfeɪvə/", "việc giúp đỡ", "Can I ask you a favour?"],
      ["at the moment", "/ət ðə ˈməʊmənt/", "ngay lúc này", "I am busy at the moment."],
      ["appointment", "/əˈpɔɪntmənt/", "cuộc hẹn", "I have an appointment at ten."],
      ["tomorrow", "/təˈmɒrəʊ/", "ngày mai", "We are meeting tomorrow morning."],
      ["convenient", "/kənˈviːniənt/", "thuận tiện", "Is Tuesday convenient for you?"],
      ["take notes", "/ˌteɪk ˈnəʊts/", "ghi chép", "Can you take notes in the meeting?"],
      ["book a room", "/ˌbʊk ə ˈruːm/", "đặt phòng", "I am booking a room for Friday."],
      ["answer the phone", "/ˌɑːnsə ðə ˈfəʊn/", "nghe điện thoại", "She is answering the phone."],
      ["check emails", "/ˌtʃek ˈiːmeɪlz/", "kiểm tra email", "He is checking his emails."],
      ["print a document", "/ˌprɪnt ə ˈdɒkjumənt/", "in tài liệu", "I am printing a document for the client."],
      ["share a file", "/ˌʃeə ə ˈfaɪl/", "chia sẻ tệp", "Can you share the file with me?"],
      ["agenda", "/əˈdʒendə/", "chương trình cuộc họp", "What is on the agenda today?"],
      ["confirm", "/kənˈfɜːm/", "xác nhận", "Can you confirm the time?"],
      ["attend", "/əˈtend/", "tham dự", "I can't attend the meeting."],
      ["invite", "/ɪnˈvaɪt/", "mời", "We are inviting the whole team."],
      ["reschedule", "/ˌriːˈʃedjuːl/", "dời lịch", "Can we reschedule the call?"],
      ["remind", "/rɪˈmaɪnd/", "nhắc nhở", "Please remind me tomorrow."]
    ],
    phrases: [
      ["What are you working on?", "Bạn đang làm việc gì vậy?"],
      ["I am writing a report at the moment.", "Hiện tại tôi đang viết báo cáo."],
      ["She is talking to a customer.", "Cô ấy đang nói chuyện với khách hàng."],
      ["Are you free at two o'clock?", "Bạn có rảnh lúc hai giờ không?"],
      ["Can we meet to discuss the project?", "Chúng ta gặp nhau để bàn về dự án được không?"],
      ["I am sorry, I am busy on Monday.", "Xin lỗi, thứ Hai tôi bận."],
      ["How about Tuesday morning?", "Sáng thứ Ba thì sao?"],
      ["Can we postpone the meeting?", "Chúng ta hoãn cuộc họp được không?"],
      ["Can I ask you a favour?", "Tôi nhờ bạn một việc được không?"],
      ["No problem. I can help you.", "Không vấn đề gì. Tôi giúp được."]
    ],
    dialogue: {
      title: "Sắp xếp cuộc họp",
      lines: [
        ["A", "Hi, Linh. Are you free tomorrow at two?"],
        ["B", "Sorry, I am meeting a client at two. Why?"],
        ["A", "I want to discuss the new project with you."],
        ["B", "How about Thursday morning?"],
        ["A", "Thursday is fine. Is ten o'clock convenient?"],
        ["B", "Yes, ten o'clock is good. Where can we meet?"],
        ["A", "In meeting room three. See you on Thursday."]
      ],
      questions: [
        ["Why can't Linh meet tomorrow at two?", ["She is on holiday", "She is meeting a client", "She is writing a report"], 1],
        ["When is the meeting?", ["Thursday at ten", "Tuesday at two", "Thursday at two"], 0],
        ["Where is the meeting?", ["In the office kitchen", "At reception", "In meeting room three"], 2]
      ]
    }
  },
  {
    id: 6, title: "An office move", vi: "Chuyển văn phòng",
    topics: "Tính từ mô tả · So sánh hơn, so sánh nhất · Báo giá, đặt hàng · Trình bày slide",
    videos: [
      ["FwoLnGDAmes", "6.1.1 An office move"],
      ["AUwzmn-XQ-Q", "6.4.1 A presentation about office equipment"]
    ],
    vocab: [
      ["cheap", "/tʃiːp/", "rẻ", "This office is cheap."],
      ["expensive", "/ɪkˈspensɪv/", "đắt", "The city centre is more expensive."],
      ["big", "/bɪɡ/", "to, lớn", "We need a bigger warehouse."],
      ["small", "/smɔːl/", "nhỏ", "The old office is too small."],
      ["modern", "/ˈmɒdn/", "hiện đại", "The new building is very modern."],
      ["quiet", "/ˈkwaɪət/", "yên tĩnh", "This room is quieter than that one."],
      ["noisy", "/ˈnɔɪzi/", "ồn ào", "The street is very noisy."],
      ["comfortable", "/ˈkʌmftəbl/", "thoải mái", "These chairs are more comfortable."],
      ["better", "/ˈbetə/", "tốt hơn", "The second quote is better."],
      ["the best", "/ðə best/", "tốt nhất", "Which supplier is the best?"],
      ["worse", "/wɜːs/", "tệ hơn", "The service is worse this year."],
      ["supplier", "/səˈplaɪə/", "nhà cung cấp", "We have a new supplier for desks."],
      ["quote", "/kwəʊt/", "báo giá", "Can you send me a quote?"],
      ["price", "/praɪs/", "giá", "What is the price of this printer?"],
      ["discount", "/ˈdɪskaʊnt/", "chiết khấu, giảm giá", "They offer a ten percent discount."],
      ["equipment", "/ɪˈkwɪpmənt/", "thiết bị", "We need new office equipment."],
      ["warehouse", "/ˈweəhaʊs/", "nhà kho", "The warehouse is near the port."],
      ["slide", "/slaɪd/", "trang trình chiếu", "As you can see on the slide, sales are up."],
      ["fast", "/fɑːst/", "nhanh", "This printer is faster than the old one."],
      ["slow", "/sləʊ/", "chậm", "The internet is very slow today."],
      ["heavy", "/ˈhevi/", "nặng", "These boxes are heavy."],
      ["light", "/laɪt/", "nhẹ; sáng sủa", "The new laptop is lighter."],
      ["close", "/kləʊs/", "gần", "The office is close to the station."],
      ["far", "/fɑː/", "xa", "The warehouse is far from the city."],
      ["the worst", "/ðə wɜːst/", "tệ nhất", "This is the worst option."],
      ["rent", "/rent/", "tiền thuê; thuê", "The rent is two thousand dollars a month."],
      ["location", "/ləʊˈkeɪʃn/", "vị trí, địa điểm", "The location is very good."],
      ["furniture", "/ˈfɜːnɪtʃə/", "đồ nội thất", "We need new furniture for the office."],
      ["compare", "/kəmˈpeə/", "so sánh", "Let us compare the two quotes."],
      ["option", "/ˈɒpʃn/", "lựa chọn, phương án", "We have three options."]
    ],
    phrases: [
      ["This office is cheaper than that one.", "Văn phòng này rẻ hơn văn phòng kia."],
      ["The new building is more modern.", "Tòa nhà mới hiện đại hơn."],
      ["Which one is better?", "Cái nào tốt hơn?"],
      ["This is the best option.", "Đây là lựa chọn tốt nhất."],
      ["Can you send me a quote, please?", "Bạn gửi cho tôi báo giá được không?"],
      ["How much is the delivery?", "Phí giao hàng là bao nhiêu?"],
      ["If we order twenty, can we have a discount?", "Nếu chúng tôi đặt hai mươi cái thì có được giảm giá không?"],
      ["As you can see on the slide, the price is lower.", "Như bạn thấy trên slide, giá thấp hơn."],
      ["I think we should choose the second one.", "Tôi nghĩ chúng ta nên chọn cái thứ hai."],
      ["It is bigger and closer to the city centre.", "Nó lớn hơn và gần trung tâm thành phố hơn."]
    ],
    dialogue: {
      title: "Chọn văn phòng mới",
      lines: [
        ["A", "We have two options for the new office. What do you think?"],
        ["B", "The first office is cheaper, but it is very small."],
        ["A", "Yes, and the second one is bigger and more modern."],
        ["B", "Is it more expensive?"],
        ["A", "Yes, it is two hundred dollars more every month."],
        ["B", "But it is closer to the station. I think it is the best option."],
        ["A", "I agree. Let us choose the second office."]
      ],
      questions: [
        ["Which office is cheaper?", ["The first", "The second", "They are the same"], 0],
        ["How much more is the second office every month?", ["One hundred dollars", "Two hundred dollars", "Twenty dollars"], 1],
        ["Which office do they choose?", ["The first", "No office", "The second"], 2]
      ]
    }
  },
  {
    id: 7, title: "Procedures", vi: "Quy trình",
    topics: "Mô tả quy trình · have to / must · Hướng dẫn từng bước · Đề xuất cải tiến",
    videos: [
      ["hQgrwuI4nxE", "7.1.1 Paying suppliers"],
      ["sx84xpdPBAk", "7.4.1 A new workflow"],
      ["Zm487-6Vhsk", "7.4.2 A new workflow"]
    ],
    vocab: [
      ["procedure", "/prəˈsiːdʒə/", "quy trình, thủ tục", "What is the procedure for paying suppliers?"],
      ["step", "/step/", "bước", "The first step is to check the order."],
      ["invoice", "/ˈɪnvɔɪs/", "hóa đơn", "Please send the invoice to Finance."],
      ["payment", "/ˈpeɪmənt/", "khoản thanh toán", "The payment is due in thirty days."],
      ["approve", "/əˈpruːv/", "phê duyệt", "The manager has to approve the payment."],
      ["sign", "/saɪn/", "ký", "You have to sign the form."],
      ["form", "/fɔːm/", "biểu mẫu", "Please fill in this form."],
      ["have to", "/ˈhæv tə/", "phải", "You have to wear a helmet here."],
      ["must", "/mʌst/", "phải, bắt buộc", "You must not smoke in the factory."],
      ["workflow", "/ˈwɜːkfləʊ/", "luồng công việc", "The new workflow is faster."],
      ["manual", "/ˈmænjuəl/", "sách hướng dẫn", "Read the manual before you start."],
      ["instruction", "/ɪnˈstrʌkʃn/", "chỉ dẫn, hướng dẫn", "Follow the instructions on the screen."],
      ["click", "/klɪk/", "bấm chuột", "Click on the green button."],
      ["enter", "/ˈentə/", "nhập (dữ liệu)", "Enter your password here."],
      ["save", "/seɪv/", "lưu", "Do not forget to save the file."],
      ["suggestion", "/səˈdʒestʃən/", "đề xuất, gợi ý", "I have a suggestion."],
      ["improve", "/ɪmˈpruːv/", "cải thiện", "How can we improve the process?"],
      ["responsible", "/rɪˈspɒnsəbl/", "chịu trách nhiệm", "Who is responsible for this step?"],
      ["next", "/nekst/", "tiếp theo", "Next, send the form to Finance."],
      ["finally", "/ˈfaɪnəli/", "cuối cùng", "Finally, click on the send button."],
      ["fill in", "/ˌfɪl ˈɪn/", "điền vào", "You have to fill in all the boxes."],
      ["attach", "/əˈtætʃ/", "đính kèm", "Attach the invoice to the email."],
      ["submit", "/səbˈmɪt/", "nộp, gửi đi", "Submit the form before Friday."],
      ["log in", "/ˌlɒɡ ˈɪn/", "đăng nhập", "First, log in to the system."],
      ["password", "/ˈpɑːswɜːd/", "mật khẩu", "You must change your password every month."],
      ["button", "/ˈbʌtn/", "nút bấm", "Press the red button to stop the machine."],
      ["receipt", "/rɪˈsiːt/", "biên lai", "You have to keep the receipt."],
      ["process", "/ˈprəʊses/", "quá trình, quy trình", "The process has five steps."],
      ["rule", "/ruːl/", "quy định", "We have to follow the rules."],
      ["safety", "/ˈseɪfti/", "sự an toàn", "Safety is very important in the factory."]
    ],
    phrases: [
      ["What is the procedure?", "Quy trình như thế nào?"],
      ["First, check the invoice.", "Đầu tiên, kiểm tra hóa đơn."],
      ["Then send it to the manager.", "Sau đó gửi nó cho quản lý."],
      ["The manager has to approve the payment.", "Quản lý phải phê duyệt khoản thanh toán."],
      ["You don't have to print the form.", "Bạn không cần phải in biểu mẫu."],
      ["Click on the button and enter your name.", "Bấm vào nút và nhập tên của bạn."],
      ["Finally, save the file.", "Cuối cùng, lưu tệp lại."],
      ["Why don't we use a new system?", "Sao chúng ta không dùng một hệ thống mới?"],
      ["That is a good idea.", "Đó là một ý hay."],
      ["I am not sure about that.", "Tôi không chắc về điều đó."]
    ],
    dialogue: {
      title: "Giải thích quy trình thanh toán",
      lines: [
        ["A", "I am new here. What is the procedure for paying suppliers?"],
        ["B", "It is easy. First, you have to check the invoice."],
        ["A", "OK. And then?"],
        ["B", "Then you enter the invoice number in the system."],
        ["A", "Do I have to print the invoice?"],
        ["B", "No, you don't have to print it. But the manager has to approve it."],
        ["A", "I see. Finally, Finance pays the supplier. Thank you."]
      ],
      questions: [
        ["What is the first step?", ["Print the invoice", "Check the invoice", "Pay the supplier"], 1],
        ["Does the new employee have to print the invoice?", ["No", "Yes", "Only on Monday"], 0],
        ["Who has to approve the invoice?", ["The supplier", "The new employee", "The manager"], 2]
      ]
    }
  },
  {
    id: 8, title: "Managing projects", vi: "Quản lý dự án",
    topics: "Sản xuất · Tiết kiệm chi phí · Lập kế hoạch dự án · Đưa và nhận phản hồi",
    videos: [
      ["bpKB37eqG8U", "8.1.1 Making cars at The Morgan Motor Company"],
      ["MF6MusJUlDQ", "8.4.1 Feedback in the office"]
    ],
    vocab: [
      ["project", "/ˈprɒdʒekt/", "dự án", "The project starts next month."],
      ["plan", "/plæn/", "kế hoạch; lập kế hoạch", "We are going to plan the next phase."],
      ["budget", "/ˈbʌdʒɪt/", "ngân sách", "The budget is fifty thousand dollars."],
      ["cost", "/kɒst/", "chi phí", "We have to reduce costs."],
      ["reduce", "/rɪˈdjuːs/", "giảm bớt", "The new machine reduces energy use."],
      ["save money", "/ˌseɪv ˈmʌni/", "tiết kiệm tiền", "We saved money on transport."],
      ["take", "/teɪk/", "mất (thời gian)", "How long does it take?"],
      ["build", "/bɪld/", "xây dựng, chế tạo", "It takes four weeks to build a car."],
      ["production", "/prəˈdʌkʃn/", "sự sản xuất", "Production starts in March."],
      ["quality", "/ˈkwɒləti/", "chất lượng", "Quality is very important for us."],
      ["on time", "/ɒn ˈtaɪm/", "đúng hạn", "We finished the project on time."],
      ["schedule", "/ˈʃedjuːl/", "tiến độ, lịch trình", "We are behind schedule."],
      ["task", "/tɑːsk/", "nhiệm vụ", "Each task has a deadline."],
      ["update", "/ˈʌpdeɪt/", "bản cập nhật", "Can you give me an update?"],
      ["feedback", "/ˈfiːdbæk/", "phản hồi, nhận xét", "Thank you for your feedback."],
      ["result", "/rɪˈzʌlt/", "kết quả", "The results are very good."],
      ["going to", "/ˈɡəʊɪŋ tə/", "sẽ, dự định", "We are going to hire two engineers."],
      ["well done", "/ˌwel ˈdʌn/", "làm tốt lắm", "Well done, everyone!"],
      ["test", "/test/", "thử nghiệm, kiểm thử", "We are going to test the new system."],
      ["launch", "/lɔːntʃ/", "ra mắt", "We launch the product in June."],
      ["phase", "/feɪz/", "giai đoạn", "Phase one is finished."],
      ["hire", "/ˈhaɪə/", "tuyển dụng, thuê", "We need to hire a new engineer."],
      ["increase", "/ɪnˈkriːs/", "tăng lên", "Sales increased last year."],
      ["spend", "/spend/", "chi tiêu; dành (thời gian)", "We spend a lot of money on energy."],
      ["behind schedule", "/bɪˌhaɪnd ˈʃedjuːl/", "chậm tiến độ", "The project is behind schedule."],
      ["under budget", "/ˌʌndə ˈbʌdʒɪt/", "dưới ngân sách", "We finished under budget."],
      ["goal", "/ɡəʊl/", "mục tiêu", "Our goal is to finish in May."],
      ["risk", "/rɪsk/", "rủi ro", "There is a risk of delay."],
      ["deliver", "/dɪˈlɪvə/", "giao, bàn giao", "We deliver the project next month."],
      ["complete", "/kəmˈpliːt/", "hoàn thành", "The team completed all the tasks."]
    ],
    phrases: [
      ["How long does it take?", "Việc đó mất bao lâu?"],
      ["It takes two weeks.", "Mất hai tuần."],
      ["We are going to start in March.", "Chúng tôi dự định bắt đầu vào tháng Ba."],
      ["We finished the project on time.", "Chúng tôi đã hoàn thành dự án đúng hạn."],
      ["We saved a lot of money last year.", "Năm ngoái chúng tôi đã tiết kiệm được nhiều tiền."],
      ["Can you give me an update?", "Bạn cập nhật tình hình cho tôi được không?"],
      ["We are a little behind schedule.", "Chúng tôi hơi chậm tiến độ."],
      ["You did a great job.", "Bạn đã làm rất tốt."],
      ["Next time, please check the numbers.", "Lần sau, vui lòng kiểm tra các con số."],
      ["Thank you for your feedback.", "Cảm ơn nhận xét của bạn."]
    ],
    dialogue: {
      title: "Cập nhật tiến độ dự án",
      lines: [
        ["A", "Hi, Nam. Can you give me an update on the project?"],
        ["B", "Sure. We finished the design last week."],
        ["A", "Great. Are we on schedule?"],
        ["B", "We are two days behind schedule, but we are under budget."],
        ["A", "Good. What are you going to do next?"],
        ["B", "We are going to start the tests on Monday. They take three days."],
        ["A", "Well done. You and the team did a great job."]
      ],
      questions: [
        ["What did the team finish last week?", ["The tests", "The design", "The budget"], 1],
        ["How late is the project?", ["Two days", "Three days", "One week"], 0],
        ["When do the tests start?", ["Last week", "Tomorrow", "On Monday"], 2]
      ]
    }
  }
];
