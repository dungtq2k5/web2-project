const vnAddresses = [
  {
    "name": "Thành phố Hà Nội",
    "code": 1,
    "codename": "thanh_pho_ha_noi",
    "division_type": "tỉnh",
    "phone_code": 24,
    "districts": [
      {
        "name": "Quận Ba Đình",
        "code": 1,
        "codename": "quan_ba_dinh",
        "division_type": "huyện",
        "short_codename": "ba_dinh",
        "wards": [
          {
            "name": "Phường Phúc Xá",
            "code": 1,
            "codename": "phuong_phuc_xa",
            "division_type": "xã",
            "short_codename": "phuc_xa"
          },
          {
            "name": "Phường Trúc Bạch",
            "code": 4,
            "codename": "phuong_truc_bach",
            "division_type": "xã",
            "short_codename": "truc_bach"
          },
          {
            "name": "Phường Vĩnh Phúc",
            "code": 6,
            "codename": "phuong_vinh_phuc",
            "division_type": "xã",
            "short_codename": "vinh_phuc"
          },
          {
            "name": "Phường Cống Vị",
            "code": 7,
            "codename": "phuong_cong_vi",
            "division_type": "xã",
            "short_codename": "cong_vi"
          },
          {
            "name": "Phường Liễu Giai",
            "code": 8,
            "codename": "phuong_lieu_giai",
            "division_type": "xã",
            "short_codename": "lieu_giai"
          },
          {
            "name": "Phường Quán Thánh",
            "code": 13,
            "codename": "phuong_quan_thanh",
            "division_type": "xã",
            "short_codename": "quan_thanh"
          },
          {
            "name": "Phường Ngọc Hà",
            "code": 16,
            "codename": "phuong_ngoc_ha",
            "division_type": "xã",
            "short_codename": "ngoc_ha"
          },
          {
            "name": "Phường Điện Biên",
            "code": 19,
            "codename": "phuong_dien_bien",
            "division_type": "xã",
            "short_codename": "dien_bien"
          },
          {
            "name": "Phường Đội Cấn",
            "code": 22,
            "codename": "phuong_doi_can",
            "division_type": "xã",
            "short_codename": "doi_can"
          },
          {
            "name": "Phường Ngọc Khánh",
            "code": 25,
            "codename": "phuong_ngoc_khanh",
            "division_type": "xã",
            "short_codename": "ngoc_khanh"
          },
          {
            "name": "Phường Kim Mã",
            "code": 28,
            "codename": "phuong_kim_ma",
            "division_type": "xã",
            "short_codename": "kim_ma"
          },
          {
            "name": "Phường Giảng Võ",
            "code": 31,
            "codename": "phuong_giang_vo",
            "division_type": "xã",
            "short_codename": "giang_vo"
          },
          {
            "name": "Phường Thành Công",
            "code": 34,
            "codename": "phuong_thanh_cong",
            "division_type": "xã",
            "short_codename": "thanh_cong"
          }
        ]
      },
      {
        "name": "Quận Hoàn Kiếm",
        "code": 2,
        "codename": "quan_hoan_kiem",
        "division_type": "huyện",
        "short_codename": "hoan_kiem",
        "wards": [
          {
            "name": "Phường Phúc Tân",
            "code": 37,
            "codename": "phuong_phuc_tan",
            "division_type": "xã",
            "short_codename": "phuc_tan"
          },
          {
            "name": "Phường Đồng Xuân",
            "code": 40,
            "codename": "phuong_dong_xuan",
            "division_type": "xã",
            "short_codename": "dong_xuan"
          },
          {
            "name": "Phường Hàng Mã",
            "code": 43,
            "codename": "phuong_hang_ma",
            "division_type": "xã",
            "short_codename": "hang_ma"
          },
          {
            "name": "Phường Hàng Buồm",
            "code": 46,
            "codename": "phuong_hang_buom",
            "division_type": "xã",
            "short_codename": "hang_buom"
          },
          {
            "name": "Phường Hàng Đào",
            "code": 49,
            "codename": "phuong_hang_dao",
            "division_type": "xã",
            "short_codename": "hang_dao"
          },
          {
            "name": "Phường Hàng Bồ",
            "code": 52,
            "codename": "phuong_hang_bo",
            "division_type": "xã",
            "short_codename": "hang_bo"
          },
          {
            "name": "Phường Cửa Đông",
            "code": 55,
            "codename": "phuong_cua_dong",
            "division_type": "xã",
            "short_codename": "cua_dong"
          },
          {
            "name": "Phường Lý Thái Tổ",
            "code": 58,
            "codename": "phuong_ly_thai_to",
            "division_type": "xã",
            "short_codename": "ly_thai_to"
          },
          {
            "name": "Phường Hàng Bạc",
            "code": 61,
            "codename": "phuong_hang_bac",
            "division_type": "xã",
            "short_codename": "hang_bac"
          },
          {
            "name": "Phường Hàng Gai",
            "code": 64,
            "codename": "phuong_hang_gai",
            "division_type": "xã",
            "short_codename": "hang_gai"
          },
          {
            "name": "Phường Chương Dương",
            "code": 67,
            "codename": "phuong_chuong_duong",
            "division_type": "xã",
            "short_codename": "chuong_duong"
          },
          {
            "name": "Phường Hàng Trống",
            "code": 70,
            "codename": "phuong_hang_trong",
            "division_type": "xã",
            "short_codename": "hang_trong"
          },
          {
            "name": "Phường Cửa Nam",
            "code": 73,
            "codename": "phuong_cua_nam",
            "division_type": "xã",
            "short_codename": "cua_nam"
          },
          {
            "name": "Phường Hàng Bông",
            "code": 76,
            "codename": "phuong_hang_bong",
            "division_type": "xã",
            "short_codename": "hang_bong"
          },
          {
            "name": "Phường Tràng Tiền",
            "code": 79,
            "codename": "phuong_trang_tien",
            "division_type": "xã",
            "short_codename": "trang_tien"
          },
          {
            "name": "Phường Trần Hưng Đạo",
            "code": 82,
            "codename": "phuong_tran_hung_dao",
            "division_type": "xã",
            "short_codename": "tran_hung_dao"
          },
          {
            "name": "Phường Phan Chu Trinh",
            "code": 85,
            "codename": "phuong_phan_chu_trinh",
            "division_type": "xã",
            "short_codename": "phan_chu_trinh"
          },
          {
            "name": "Phường Hàng Bài",
            "code": 88,
            "codename": "phuong_hang_bai",
            "division_type": "xã",
            "short_codename": "hang_bai"
          }
        ]
      },
      {
        "name": "Quận Tây Hồ",
        "code": 3,
        "codename": "quan_tay_ho",
        "division_type": "huyện",
        "short_codename": "tay_ho",
        "wards": [
          {
            "name": "Phường Phú Thượng",
            "code": 91,
            "codename": "phuong_phu_thuong",
            "division_type": "xã",
            "short_codename": "phu_thuong"
          },
          {
            "name": "Phường Nhật Tân",
            "code": 94,
            "codename": "phuong_nhat_tan",
            "division_type": "xã",
            "short_codename": "nhat_tan"
          },
          {
            "name": "Phường Tứ Liên",
            "code": 97,
            "codename": "phuong_tu_lien",
            "division_type": "xã",
            "short_codename": "tu_lien"
          },
          {
            "name": "Phường Quảng An",
            "code": 100,
            "codename": "phuong_quang_an",
            "division_type": "xã",
            "short_codename": "quang_an"
          },
          {
            "name": "Phường Xuân La",
            "code": 103,
            "codename": "phuong_xuan_la",
            "division_type": "xã",
            "short_codename": "xuan_la"
          },
          {
            "name": "Phường Yên Phụ",
            "code": 106,
            "codename": "phuong_yen_phu",
            "division_type": "xã",
            "short_codename": "yen_phu"
          },
          {
            "name": "Phường Bưởi",
            "code": 109,
            "codename": "phuong_buoi",
            "division_type": "xã",
            "short_codename": "buoi"
          },
          {
            "name": "Phường Thụy Khuê",
            "code": 112,
            "codename": "phuong_thuy_khue",
            "division_type": "xã",
            "short_codename": "thuy_khue"
          }
        ]
      },
      {
        "name": "Quận Long Biên",
        "code": 4,
        "codename": "quan_long_bien",
        "division_type": "huyện",
        "short_codename": "long_bien",
        "wards": [
          {
            "name": "Phường Thượng Thanh",
            "code": 115,
            "codename": "phuong_thuong_thanh",
            "division_type": "xã",
            "short_codename": "thuong_thanh"
          },
          {
            "name": "Phường Ngọc Thụy",
            "code": 118,
            "codename": "phuong_ngoc_thuy",
            "division_type": "xã",
            "short_codename": "ngoc_thuy"
          },
          {
            "name": "Phường Giang Biên",
            "code": 121,
            "codename": "phuong_giang_bien",
            "division_type": "xã",
            "short_codename": "giang_bien"
          },
          {
            "name": "Phường Đức Giang",
            "code": 124,
            "codename": "phuong_duc_giang",
            "division_type": "xã",
            "short_codename": "duc_giang"
          },
          {
            "name": "Phường Việt Hưng",
            "code": 127,
            "codename": "phuong_viet_hung",
            "division_type": "xã",
            "short_codename": "viet_hung"
          },
          {
            "name": "Phường Gia Thụy",
            "code": 130,
            "codename": "phuong_gia_thuy",
            "division_type": "xã",
            "short_codename": "gia_thuy"
          },
          {
            "name": "Phường Ngọc Lâm",
            "code": 133,
            "codename": "phuong_ngoc_lam",
            "division_type": "xã",
            "short_codename": "ngoc_lam"
          },
          {
            "name": "Phường Phúc Lợi",
            "code": 136,
            "codename": "phuong_phuc_loi",
            "division_type": "xã",
            "short_codename": "phuc_loi"
          },
          {
            "name": "Phường Bồ Đề",
            "code": 139,
            "codename": "phuong_bo_de",
            "division_type": "xã",
            "short_codename": "bo_de"
          },
          {
            "name": "Phường Long Biên",
            "code": 145,
            "codename": "phuong_long_bien",
            "division_type": "xã",
            "short_codename": "long_bien"
          },
          {
            "name": "Phường Thạch Bàn",
            "code": 148,
            "codename": "phuong_thach_ban",
            "division_type": "xã",
            "short_codename": "thach_ban"
          },
          {
            "name": "Phường Phúc Đồng",
            "code": 151,
            "codename": "phuong_phuc_dong",
            "division_type": "xã",
            "short_codename": "phuc_dong"
          },
          {
            "name": "Phường Cự Khối",
            "code": 154,
            "codename": "phuong_cu_khoi",
            "division_type": "xã",
            "short_codename": "cu_khoi"
          }
        ]
      },
      {
        "name": "Quận Cầu Giấy",
        "code": 5,
        "codename": "quan_cau_giay",
        "division_type": "huyện",
        "short_codename": "cau_giay",
        "wards": [
          {
            "name": "Phường Nghĩa Đô",
            "code": 157,
            "codename": "phuong_nghia_do",
            "division_type": "xã",
            "short_codename": "nghia_do"
          },
          {
            "name": "Phường Nghĩa Tân",
            "code": 160,
            "codename": "phuong_nghia_tan",
            "division_type": "xã",
            "short_codename": "nghia_tan"
          },
          {
            "name": "Phường Mai Dịch",
            "code": 163,
            "codename": "phuong_mai_dich",
            "division_type": "xã",
            "short_codename": "mai_dich"
          },
          {
            "name": "Phường Dịch Vọng",
            "code": 166,
            "codename": "phuong_dich_vong",
            "division_type": "xã",
            "short_codename": "dich_vong"
          },
          {
            "name": "Phường Dịch Vọng Hậu",
            "code": 167,
            "codename": "phuong_dich_vong_hau",
            "division_type": "xã",
            "short_codename": "dich_vong_hau"
          },
          {
            "name": "Phường Quan Hoa",
            "code": 169,
            "codename": "phuong_quan_hoa",
            "division_type": "xã",
            "short_codename": "quan_hoa"
          },
          {
            "name": "Phường Yên Hoà",
            "code": 172,
            "codename": "phuong_yen_hoa",
            "division_type": "xã",
            "short_codename": "yen_hoa"
          },
          {
            "name": "Phường Trung Hoà",
            "code": 175,
            "codename": "phuong_trung_hoa",
            "division_type": "xã",
            "short_codename": "trung_hoa"
          }
        ]
      },
      {
        "name": "Quận Đống Đa",
        "code": 6,
        "codename": "quan_dong_da",
        "division_type": "huyện",
        "short_codename": "dong_da",
        "wards": [
          {
            "name": "Phường Cát Linh",
            "code": 178,
            "codename": "phuong_cat_linh",
            "division_type": "xã",
            "short_codename": "cat_linh"
          },
          {
            "name": "Phường Văn Miếu - Quốc Tử Giám",
            "code": 181,
            "codename": "phuong_van_mieu_quoc_tu_giam",
            "division_type": "xã",
            "short_codename": "van_mieu_quoc_tu_giam"
          },
          {
            "name": "Phường Láng Thượng",
            "code": 187,
            "codename": "phuong_lang_thuong",
            "division_type": "xã",
            "short_codename": "lang_thuong"
          },
          {
            "name": "Phường Ô Chợ Dừa",
            "code": 190,
            "codename": "phuong_o_cho_dua",
            "division_type": "xã",
            "short_codename": "o_cho_dua"
          },
          {
            "name": "Phường Văn Chương",
            "code": 193,
            "codename": "phuong_van_chuong",
            "division_type": "xã",
            "short_codename": "van_chuong"
          },
          {
            "name": "Phường Hàng Bột",
            "code": 196,
            "codename": "phuong_hang_bot",
            "division_type": "xã",
            "short_codename": "hang_bot"
          },
          {
            "name": "Phường Láng Hạ",
            "code": 199,
            "codename": "phuong_lang_ha",
            "division_type": "xã",
            "short_codename": "lang_ha"
          },
          {
            "name": "Phường Khâm Thiên",
            "code": 202,
            "codename": "phuong_kham_thien",
            "division_type": "xã",
            "short_codename": "kham_thien"
          },
          {
            "name": "Phường Thổ Quan",
            "code": 205,
            "codename": "phuong_tho_quan",
            "division_type": "xã",
            "short_codename": "tho_quan"
          },
          {
            "name": "Phường Nam Đồng",
            "code": 208,
            "codename": "phuong_nam_dong",
            "division_type": "xã",
            "short_codename": "nam_dong"
          },
          {
            "name": "Phường Quang Trung",
            "code": 214,
            "codename": "phuong_quang_trung",
            "division_type": "xã",
            "short_codename": "quang_trung"
          },
          {
            "name": "Phường Trung Liệt",
            "code": 217,
            "codename": "phuong_trung_liet",
            "division_type": "xã",
            "short_codename": "trung_liet"
          },
          {
            "name": "Phường Phương Liên - Trung Tự",
            "code": 226,
            "codename": "phuong_phuong_lien_trung_tu",
            "division_type": "xã",
            "short_codename": "phuong_lien_trung_tu"
          },
          {
            "name": "Phường Kim Liên",
            "code": 229,
            "codename": "phuong_kim_lien",
            "division_type": "xã",
            "short_codename": "kim_lien"
          },
          {
            "name": "Phường Phương Mai",
            "code": 232,
            "codename": "phuong_phuong_mai",
            "division_type": "xã",
            "short_codename": "phuong_mai"
          },
          {
            "name": "Phường Thịnh Quang",
            "code": 235,
            "codename": "phuong_thinh_quang",
            "division_type": "xã",
            "short_codename": "thinh_quang"
          },
          {
            "name": "Phường Khương Thượng",
            "code": 238,
            "codename": "phuong_khuong_thuong",
            "division_type": "xã",
            "short_codename": "khuong_thuong"
          }
        ]
      },
      {
        "name": "Quận Hai Bà Trưng",
        "code": 7,
        "codename": "quan_hai_ba_trung",
        "division_type": "huyện",
        "short_codename": "hai_ba_trung",
        "wards": [
          {
            "name": "Phường Nguyễn Du",
            "code": 241,
            "codename": "phuong_nguyen_du",
            "division_type": "xã",
            "short_codename": "nguyen_du"
          },
          {
            "name": "Phường Bạch Đằng",
            "code": 244,
            "codename": "phuong_bach_dang",
            "division_type": "xã",
            "short_codename": "bach_dang"
          },
          {
            "name": "Phường Phạm Đình Hổ",
            "code": 247,
            "codename": "phuong_pham_dinh_ho",
            "division_type": "xã",
            "short_codename": "pham_dinh_ho"
          },
          {
            "name": "Phường Lê Đại Hành",
            "code": 256,
            "codename": "phuong_le_dai_hanh",
            "division_type": "xã",
            "short_codename": "le_dai_hanh"
          },
          {
            "name": "Phường Đồng Nhân",
            "code": 259,
            "codename": "phuong_dong_nhan",
            "division_type": "xã",
            "short_codename": "dong_nhan"
          },
          {
            "name": "Phường Phố Huế",
            "code": 262,
            "codename": "phuong_pho_hue",
            "division_type": "xã",
            "short_codename": "pho_hue"
          },
          {
            "name": "Phường Thanh Lương",
            "code": 268,
            "codename": "phuong_thanh_luong",
            "division_type": "xã",
            "short_codename": "thanh_luong"
          },
          {
            "name": "Phường Thanh Nhàn",
            "code": 271,
            "codename": "phuong_thanh_nhan",
            "division_type": "xã",
            "short_codename": "thanh_nhan"
          },
          {
            "name": "Phường Bách Khoa",
            "code": 277,
            "codename": "phuong_bach_khoa",
            "division_type": "xã",
            "short_codename": "bach_khoa"
          },
          {
            "name": "Phường Đồng Tâm",
            "code": 280,
            "codename": "phuong_dong_tam",
            "division_type": "xã",
            "short_codename": "dong_tam"
          },
          {
            "name": "Phường Vĩnh Tuy",
            "code": 283,
            "codename": "phuong_vinh_tuy",
            "division_type": "xã",
            "short_codename": "vinh_tuy"
          },
          {
            "name": "Phường Quỳnh Mai",
            "code": 289,
            "codename": "phuong_quynh_mai",
            "division_type": "xã",
            "short_codename": "quynh_mai"
          },
          {
            "name": "Phường Bạch Mai",
            "code": 292,
            "codename": "phuong_bach_mai",
            "division_type": "xã",
            "short_codename": "bach_mai"
          },
          {
            "name": "Phường Minh Khai",
            "code": 295,
            "codename": "phuong_minh_khai",
            "division_type": "xã",
            "short_codename": "minh_khai"
          },
          {
            "name": "Phường Trương Định",
            "code": 298,
            "codename": "phuong_truong_dinh",
            "division_type": "xã",
            "short_codename": "truong_dinh"
          }
        ]
      },
      {
        "name": "Quận Hoàng Mai",
        "code": 8,
        "codename": "quan_hoang_mai",
        "division_type": "huyện",
        "short_codename": "hoang_mai",
        "wards": [
          {
            "name": "Phường Thanh Trì",
            "code": 301,
            "codename": "phuong_thanh_tri",
            "division_type": "xã",
            "short_codename": "thanh_tri"
          },
          {
            "name": "Phường Vĩnh Hưng",
            "code": 304,
            "codename": "phuong_vinh_hung",
            "division_type": "xã",
            "short_codename": "vinh_hung"
          },
          {
            "name": "Phường Định Công",
            "code": 307,
            "codename": "phuong_dinh_cong",
            "division_type": "xã",
            "short_codename": "dinh_cong"
          },
          {
            "name": "Phường Mai Động",
            "code": 310,
            "codename": "phuong_mai_dong",
            "division_type": "xã",
            "short_codename": "mai_dong"
          },
          {
            "name": "Phường Tương Mai",
            "code": 313,
            "codename": "phuong_tuong_mai",
            "division_type": "xã",
            "short_codename": "tuong_mai"
          },
          {
            "name": "Phường Đại Kim",
            "code": 316,
            "codename": "phuong_dai_kim",
            "division_type": "xã",
            "short_codename": "dai_kim"
          },
          {
            "name": "Phường Tân Mai",
            "code": 319,
            "codename": "phuong_tan_mai",
            "division_type": "xã",
            "short_codename": "tan_mai"
          },
          {
            "name": "Phường Hoàng Văn Thụ",
            "code": 322,
            "codename": "phuong_hoang_van_thu",
            "division_type": "xã",
            "short_codename": "hoang_van_thu"
          },
          {
            "name": "Phường Giáp Bát",
            "code": 325,
            "codename": "phuong_giap_bat",
            "division_type": "xã",
            "short_codename": "giap_bat"
          },
          {
            "name": "Phường Lĩnh Nam",
            "code": 328,
            "codename": "phuong_linh_nam",
            "division_type": "xã",
            "short_codename": "linh_nam"
          },
          {
            "name": "Phường Thịnh Liệt",
            "code": 331,
            "codename": "phuong_thinh_liet",
            "division_type": "xã",
            "short_codename": "thinh_liet"
          },
          {
            "name": "Phường Trần Phú",
            "code": 334,
            "codename": "phuong_tran_phu",
            "division_type": "xã",
            "short_codename": "tran_phu"
          },
          {
            "name": "Phường Hoàng Liệt",
            "code": 337,
            "codename": "phuong_hoang_liet",
            "division_type": "xã",
            "short_codename": "hoang_liet"
          },
          {
            "name": "Phường Yên Sở",
            "code": 340,
            "codename": "phuong_yen_so",
            "division_type": "xã",
            "short_codename": "yen_so"
          }
        ]
      },
      {
        "name": "Quận Thanh Xuân",
        "code": 9,
        "codename": "quan_thanh_xuan",
        "division_type": "huyện",
        "short_codename": "thanh_xuan",
        "wards": [
          {
            "name": "Phường Nhân Chính",
            "code": 343,
            "codename": "phuong_nhan_chinh",
            "division_type": "xã",
            "short_codename": "nhan_chinh"
          },
          {
            "name": "Phường Thượng Đình",
            "code": 346,
            "codename": "phuong_thuong_dinh",
            "division_type": "xã",
            "short_codename": "thuong_dinh"
          },
          {
            "name": "Phường Khương Trung",
            "code": 349,
            "codename": "phuong_khuong_trung",
            "division_type": "xã",
            "short_codename": "khuong_trung"
          },
          {
            "name": "Phường Khương Mai",
            "code": 352,
            "codename": "phuong_khuong_mai",
            "division_type": "xã",
            "short_codename": "khuong_mai"
          },
          {
            "name": "Phường Thanh Xuân Trung",
            "code": 355,
            "codename": "phuong_thanh_xuan_trung",
            "division_type": "xã",
            "short_codename": "thanh_xuan_trung"
          },
          {
            "name": "Phường Phương Liệt",
            "code": 358,
            "codename": "phuong_phuong_liet",
            "division_type": "xã",
            "short_codename": "phuong_liet"
          },
          {
            "name": "Phường Khương Đình",
            "code": 364,
            "codename": "phuong_khuong_dinh",
            "division_type": "xã",
            "short_codename": "khuong_dinh"
          },
          {
            "name": "Phường Thanh Xuân Bắc",
            "code": 367,
            "codename": "phuong_thanh_xuan_bac",
            "division_type": "xã",
            "short_codename": "thanh_xuan_bac"
          },
          {
            "name": "Phường Hạ Đình",
            "code": 373,
            "codename": "phuong_ha_dinh",
            "division_type": "xã",
            "short_codename": "ha_dinh"
          }
        ]
      },
      {
        "name": "Huyện Sóc Sơn",
        "code": 16,
        "codename": "huyen_soc_son",
        "division_type": "huyện",
        "short_codename": "soc_son",
        "wards": [
          {
            "name": "Thị trấn Sóc Sơn",
            "code": 376,
            "codename": "thi_tran_soc_son",
            "division_type": "xã",
            "short_codename": "soc_son"
          },
          {
            "name": "Xã Bắc Sơn",
            "code": 379,
            "codename": "xa_bac_son",
            "division_type": "xã",
            "short_codename": "bac_son"
          },
          {
            "name": "Xã Minh Trí",
            "code": 382,
            "codename": "xa_minh_tri",
            "division_type": "xã",
            "short_codename": "minh_tri"
          },
          {
            "name": "Xã Hồng Kỳ",
            "code": 385,
            "codename": "xa_hong_ky",
            "division_type": "xã",
            "short_codename": "hong_ky"
          },
          {
            "name": "Xã Nam Sơn",
            "code": 388,
            "codename": "xa_nam_son",
            "division_type": "xã",
            "short_codename": "nam_son"
          },
          {
            "name": "Xã Trung Giã",
            "code": 391,
            "codename": "xa_trung_gia",
            "division_type": "xã",
            "short_codename": "trung_gia"
          },
          {
            "name": "Xã Tân Hưng",
            "code": 394,
            "codename": "xa_tan_hung",
            "division_type": "xã",
            "short_codename": "tan_hung"
          },
          {
            "name": "Xã Minh Phú",
            "code": 397,
            "codename": "xa_minh_phu",
            "division_type": "xã",
            "short_codename": "minh_phu"
          },
          {
            "name": "Xã Phù Linh",
            "code": 400,
            "codename": "xa_phu_linh",
            "division_type": "xã",
            "short_codename": "phu_linh"
          },
          {
            "name": "Xã Bắc Phú",
            "code": 403,
            "codename": "xa_bac_phu",
            "division_type": "xã",
            "short_codename": "bac_phu"
          },
          {
            "name": "Xã Tân Minh",
            "code": 406,
            "codename": "xa_tan_minh",
            "division_type": "xã",
            "short_codename": "tan_minh"
          },
          {
            "name": "Xã Quang Tiến",
            "code": 409,
            "codename": "xa_quang_tien",
            "division_type": "xã",
            "short_codename": "quang_tien"
          },
          {
            "name": "Xã Hiền Ninh",
            "code": 412,
            "codename": "xa_hien_ninh",
            "division_type": "xã",
            "short_codename": "hien_ninh"
          },
          {
            "name": "Xã Tân Dân",
            "code": 415,
            "codename": "xa_tan_dan",
            "division_type": "xã",
            "short_codename": "tan_dan"
          },
          {
            "name": "Xã Tiên Dược",
            "code": 418,
            "codename": "xa_tien_duoc",
            "division_type": "xã",
            "short_codename": "tien_duoc"
          },
          {
            "name": "Xã Việt Long",
            "code": 421,
            "codename": "xa_viet_long",
            "division_type": "xã",
            "short_codename": "viet_long"
          },
          {
            "name": "Xã Xuân Giang",
            "code": 424,
            "codename": "xa_xuan_giang",
            "division_type": "xã",
            "short_codename": "xuan_giang"
          },
          {
            "name": "Xã Mai Đình",
            "code": 427,
            "codename": "xa_mai_dinh",
            "division_type": "xã",
            "short_codename": "mai_dinh"
          },
          {
            "name": "Xã Đức Hoà",
            "code": 430,
            "codename": "xa_duc_hoa",
            "division_type": "xã",
            "short_codename": "duc_hoa"
          },
          {
            "name": "Xã Thanh Xuân",
            "code": 433,
            "codename": "xa_thanh_xuan",
            "division_type": "xã",
            "short_codename": "thanh_xuan"
          },
          {
            "name": "Xã Đông Xuân",
            "code": 436,
            "codename": "xa_dong_xuan",
            "division_type": "xã",
            "short_codename": "dong_xuan"
          },
          {
            "name": "Xã Kim Lũ",
            "code": 439,
            "codename": "xa_kim_lu",
            "division_type": "xã",
            "short_codename": "kim_lu"
          },
          {
            "name": "Xã Phú Cường",
            "code": 442,
            "codename": "xa_phu_cuong",
            "division_type": "xã",
            "short_codename": "phu_cuong"
          },
          {
            "name": "Xã Phú Minh",
            "code": 445,
            "codename": "xa_phu_minh",
            "division_type": "xã",
            "short_codename": "phu_minh"
          },
          {
            "name": "Xã Phù Lỗ",
            "code": 448,
            "codename": "xa_phu_lo",
            "division_type": "xã",
            "short_codename": "phu_lo"
          },
          {
            "name": "Xã Xuân Thu",
            "code": 451,
            "codename": "xa_xuan_thu",
            "division_type": "xã",
            "short_codename": "xuan_thu"
          }
        ]
      },
      {
        "name": "Huyện Đông Anh",
        "code": 17,
        "codename": "huyen_dong_anh",
        "division_type": "huyện",
        "short_codename": "dong_anh",
        "wards": [
          {
            "name": "Thị trấn Đông Anh",
            "code": 454,
            "codename": "thi_tran_dong_anh",
            "division_type": "xã",
            "short_codename": "dong_anh"
          },
          {
            "name": "Xã Xuân Nộn",
            "code": 457,
            "codename": "xa_xuan_non",
            "division_type": "xã",
            "short_codename": "xuan_non"
          },
          {
            "name": "Xã Thuỵ Lâm",
            "code": 460,
            "codename": "xa_thuy_lam",
            "division_type": "xã",
            "short_codename": "thuy_lam"
          },
          {
            "name": "Xã Bắc Hồng",
            "code": 463,
            "codename": "xa_bac_hong",
            "division_type": "xã",
            "short_codename": "bac_hong"
          },
          {
            "name": "Xã Nguyên Khê",
            "code": 466,
            "codename": "xa_nguyen_khe",
            "division_type": "xã",
            "short_codename": "nguyen_khe"
          },
          {
            "name": "Xã Nam Hồng",
            "code": 469,
            "codename": "xa_nam_hong",
            "division_type": "xã",
            "short_codename": "nam_hong"
          },
          {
            "name": "Xã Tiên Dương",
            "code": 472,
            "codename": "xa_tien_duong",
            "division_type": "xã",
            "short_codename": "tien_duong"
          },
          {
            "name": "Xã Vân Hà",
            "code": 475,
            "codename": "xa_van_ha",
            "division_type": "xã",
            "short_codename": "van_ha"
          },
          {
            "name": "Xã Uy Nỗ",
            "code": 478,
            "codename": "xa_uy_no",
            "division_type": "xã",
            "short_codename": "uy_no"
          },
          {
            "name": "Xã Vân Nội",
            "code": 481,
            "codename": "xa_van_noi",
            "division_type": "xã",
            "short_codename": "van_noi"
          },
          {
            "name": "Xã Liên Hà",
            "code": 484,
            "codename": "xa_lien_ha",
            "division_type": "xã",
            "short_codename": "lien_ha"
          },
          {
            "name": "Xã Việt Hùng",
            "code": 487,
            "codename": "xa_viet_hung",
            "division_type": "xã",
            "short_codename": "viet_hung"
          },
          {
            "name": "Xã Kim Nỗ",
            "code": 490,
            "codename": "xa_kim_no",
            "division_type": "xã",
            "short_codename": "kim_no"
          },
          {
            "name": "Xã Kim Chung",
            "code": 493,
            "codename": "xa_kim_chung",
            "division_type": "xã",
            "short_codename": "kim_chung"
          },
          {
            "name": "Xã Dục Tú",
            "code": 496,
            "codename": "xa_duc_tu",
            "division_type": "xã",
            "short_codename": "duc_tu"
          },
          {
            "name": "Xã Đại Mạch",
            "code": 499,
            "codename": "xa_dai_mach",
            "division_type": "xã",
            "short_codename": "dai_mach"
          },
          {
            "name": "Xã Vĩnh Ngọc",
            "code": 502,
            "codename": "xa_vinh_ngoc",
            "division_type": "xã",
            "short_codename": "vinh_ngoc"
          },
          {
            "name": "Xã Cổ Loa",
            "code": 505,
            "codename": "xa_co_loa",
            "division_type": "xã",
            "short_codename": "co_loa"
          },
          {
            "name": "Xã Hải Bối",
            "code": 508,
            "codename": "xa_hai_boi",
            "division_type": "xã",
            "short_codename": "hai_boi"
          },
          {
            "name": "Xã Xuân Canh",
            "code": 511,
            "codename": "xa_xuan_canh",
            "division_type": "xã",
            "short_codename": "xuan_canh"
          },
          {
            "name": "Xã Võng La",
            "code": 514,
            "codename": "xa_vong_la",
            "division_type": "xã",
            "short_codename": "vong_la"
          },
          {
            "name": "Xã Tàm Xá",
            "code": 517,
            "codename": "xa_tam_xa",
            "division_type": "xã",
            "short_codename": "tam_xa"
          },
          {
            "name": "Xã Mai Lâm",
            "code": 520,
            "codename": "xa_mai_lam",
            "division_type": "xã",
            "short_codename": "mai_lam"
          },
          {
            "name": "Xã Đông Hội",
            "code": 523,
            "codename": "xa_dong_hoi",
            "division_type": "xã",
            "short_codename": "dong_hoi"
          }
        ]
      },
      {
        "name": "Huyện Gia Lâm",
        "code": 18,
        "codename": "huyen_gia_lam",
        "division_type": "huyện",
        "short_codename": "gia_lam",
        "wards": [
          {
            "name": "Thị trấn Yên Viên",
            "code": 526,
            "codename": "thi_tran_yen_vien",
            "division_type": "xã",
            "short_codename": "yen_vien"
          },
          {
            "name": "Xã Yên Thường",
            "code": 529,
            "codename": "xa_yen_thuong",
            "division_type": "xã",
            "short_codename": "yen_thuong"
          },
          {
            "name": "Xã Yên Viên",
            "code": 532,
            "codename": "xa_yen_vien",
            "division_type": "xã",
            "short_codename": "xa_yen_vien"
          },
          {
            "name": "Xã Ninh Hiệp",
            "code": 535,
            "codename": "xa_ninh_hiep",
            "division_type": "xã",
            "short_codename": "ninh_hiep"
          },
          {
            "name": "Xã Thiên Đức",
            "code": 541,
            "codename": "xa_thien_duc",
            "division_type": "xã",
            "short_codename": "thien_duc"
          },
          {
            "name": "Xã Phù Đổng",
            "code": 544,
            "codename": "xa_phu_dong",
            "division_type": "xã",
            "short_codename": "phu_dong"
          },
          {
            "name": "Xã Lệ Chi",
            "code": 550,
            "codename": "xa_le_chi",
            "division_type": "xã",
            "short_codename": "le_chi"
          },
          {
            "name": "Xã Cổ Bi",
            "code": 553,
            "codename": "xa_co_bi",
            "division_type": "xã",
            "short_codename": "co_bi"
          },
          {
            "name": "Xã Đặng Xá",
            "code": 556,
            "codename": "xa_dang_xa",
            "division_type": "xã",
            "short_codename": "dang_xa"
          },
          {
            "name": "Xã Phú Sơn",
            "code": 562,
            "codename": "xa_phu_son",
            "division_type": "xã",
            "short_codename": "phu_son"
          },
          {
            "name": "Thị trấn Trâu Quỳ",
            "code": 565,
            "codename": "thi_tran_trau_quy",
            "division_type": "xã",
            "short_codename": "trau_quy"
          },
          {
            "name": "Xã Dương Quang",
            "code": 568,
            "codename": "xa_duong_quang",
            "division_type": "xã",
            "short_codename": "duong_quang"
          },
          {
            "name": "Xã Dương Xá",
            "code": 571,
            "codename": "xa_duong_xa",
            "division_type": "xã",
            "short_codename": "duong_xa"
          },
          {
            "name": "Xã Đa Tốn",
            "code": 577,
            "codename": "xa_da_ton",
            "division_type": "xã",
            "short_codename": "da_ton"
          },
          {
            "name": "Xã Kiêu Kỵ",
            "code": 580,
            "codename": "xa_kieu_ky",
            "division_type": "xã",
            "short_codename": "kieu_ky"
          },
          {
            "name": "Xã Bát Tràng",
            "code": 583,
            "codename": "xa_bat_trang",
            "division_type": "xã",
            "short_codename": "bat_trang"
          },
          {
            "name": "Xã Kim Đức",
            "code": 589,
            "codename": "xa_kim_duc",
            "division_type": "xã",
            "short_codename": "kim_duc"
          }
        ]
      },
      {
        "name": "Quận Nam Từ Liêm",
        "code": 19,
        "codename": "quan_nam_tu_liem",
        "division_type": "huyện",
        "short_codename": "nam_tu_liem",
        "wards": [
          {
            "name": "Phường Cầu Diễn",
            "code": 592,
            "codename": "phuong_cau_dien",
            "division_type": "xã",
            "short_codename": "cau_dien"
          },
          {
            "name": "Phường Xuân Phương",
            "code": 622,
            "codename": "phuong_xuan_phuong",
            "division_type": "xã",
            "short_codename": "xuan_phuong"
          },
          {
            "name": "Phường Phương Canh",
            "code": 623,
            "codename": "phuong_phuong_canh",
            "division_type": "xã",
            "short_codename": "phuong_canh"
          },
          {
            "name": "Phường Mỹ Đình 1",
            "code": 625,
            "codename": "phuong_my_dinh_1",
            "division_type": "xã",
            "short_codename": "my_dinh_1"
          },
          {
            "name": "Phường Mỹ Đình 2",
            "code": 626,
            "codename": "phuong_my_dinh_2",
            "division_type": "xã",
            "short_codename": "my_dinh_2"
          },
          {
            "name": "Phường Tây Mỗ",
            "code": 628,
            "codename": "phuong_tay_mo",
            "division_type": "xã",
            "short_codename": "tay_mo"
          },
          {
            "name": "Phường Mễ Trì",
            "code": 631,
            "codename": "phuong_me_tri",
            "division_type": "xã",
            "short_codename": "me_tri"
          },
          {
            "name": "Phường Phú Đô",
            "code": 632,
            "codename": "phuong_phu_do",
            "division_type": "xã",
            "short_codename": "phu_do"
          },
          {
            "name": "Phường Đại Mỗ",
            "code": 634,
            "codename": "phuong_dai_mo",
            "division_type": "xã",
            "short_codename": "dai_mo"
          },
          {
            "name": "Phường Trung Văn",
            "code": 637,
            "codename": "phuong_trung_van",
            "division_type": "xã",
            "short_codename": "trung_van"
          }
        ]
      },
      {
        "name": "Huyện Thanh Trì",
        "code": 20,
        "codename": "huyen_thanh_tri",
        "division_type": "huyện",
        "short_codename": "thanh_tri",
        "wards": [
          {
            "name": "Thị trấn Văn Điển",
            "code": 640,
            "codename": "thi_tran_van_dien",
            "division_type": "xã",
            "short_codename": "van_dien"
          },
          {
            "name": "Xã Tân Triều",
            "code": 643,
            "codename": "xa_tan_trieu",
            "division_type": "xã",
            "short_codename": "tan_trieu"
          },
          {
            "name": "Xã Thanh Liệt",
            "code": 646,
            "codename": "xa_thanh_liet",
            "division_type": "xã",
            "short_codename": "thanh_liet"
          },
          {
            "name": "Xã Tả Thanh Oai",
            "code": 649,
            "codename": "xa_ta_thanh_oai",
            "division_type": "xã",
            "short_codename": "ta_thanh_oai"
          },
          {
            "name": "Xã Hữu Hoà",
            "code": 652,
            "codename": "xa_huu_hoa",
            "division_type": "xã",
            "short_codename": "huu_hoa"
          },
          {
            "name": "Xã Tam Hiệp",
            "code": 655,
            "codename": "xa_tam_hiep",
            "division_type": "xã",
            "short_codename": "tam_hiep"
          },
          {
            "name": "Xã Tứ Hiệp",
            "code": 658,
            "codename": "xa_tu_hiep",
            "division_type": "xã",
            "short_codename": "tu_hiep"
          },
          {
            "name": "Xã Yên Mỹ",
            "code": 661,
            "codename": "xa_yen_my",
            "division_type": "xã",
            "short_codename": "yen_my"
          },
          {
            "name": "Xã Vĩnh Quỳnh",
            "code": 664,
            "codename": "xa_vinh_quynh",
            "division_type": "xã",
            "short_codename": "vinh_quynh"
          },
          {
            "name": "Xã Ngũ Hiệp",
            "code": 667,
            "codename": "xa_ngu_hiep",
            "division_type": "xã",
            "short_codename": "ngu_hiep"
          },
          {
            "name": "Xã Duyên Hà",
            "code": 670,
            "codename": "xa_duyen_ha",
            "division_type": "xã",
            "short_codename": "duyen_ha"
          },
          {
            "name": "Xã Ngọc Hồi",
            "code": 673,
            "codename": "xa_ngoc_hoi",
            "division_type": "xã",
            "short_codename": "ngoc_hoi"
          },
          {
            "name": "Xã Vạn Phúc",
            "code": 676,
            "codename": "xa_van_phuc",
            "division_type": "xã",
            "short_codename": "van_phuc"
          },
          {
            "name": "Xã Đại áng",
            "code": 679,
            "codename": "xa_dai_ang",
            "division_type": "xã",
            "short_codename": "dai_ang"
          },
          {
            "name": "Xã Liên Ninh",
            "code": 682,
            "codename": "xa_lien_ninh",
            "division_type": "xã",
            "short_codename": "lien_ninh"
          },
          {
            "name": "Xã Đông Mỹ",
            "code": 685,
            "codename": "xa_dong_my",
            "division_type": "xã",
            "short_codename": "dong_my"
          }
        ]
      },
      {
        "name": "Quận Bắc Từ Liêm",
        "code": 21,
        "codename": "quan_bac_tu_liem",
        "division_type": "huyện",
        "short_codename": "bac_tu_liem",
        "wards": [
          {
            "name": "Phường Thượng Cát",
            "code": 595,
            "codename": "phuong_thuong_cat",
            "division_type": "xã",
            "short_codename": "thuong_cat"
          },
          {
            "name": "Phường Liên Mạc",
            "code": 598,
            "codename": "phuong_lien_mac",
            "division_type": "xã",
            "short_codename": "lien_mac"
          },
          {
            "name": "Phường Đông Ngạc",
            "code": 601,
            "codename": "phuong_dong_ngac",
            "division_type": "xã",
            "short_codename": "dong_ngac"
          },
          {
            "name": "Phường Đức Thắng",
            "code": 602,
            "codename": "phuong_duc_thang",
            "division_type": "xã",
            "short_codename": "duc_thang"
          },
          {
            "name": "Phường Thụy Phương",
            "code": 604,
            "codename": "phuong_thuy_phuong",
            "division_type": "xã",
            "short_codename": "thuy_phuong"
          },
          {
            "name": "Phường Tây Tựu",
            "code": 607,
            "codename": "phuong_tay_tuu",
            "division_type": "xã",
            "short_codename": "tay_tuu"
          },
          {
            "name": "Phường Xuân Đỉnh",
            "code": 610,
            "codename": "phuong_xuan_dinh",
            "division_type": "xã",
            "short_codename": "xuan_dinh"
          },
          {
            "name": "Phường Xuân Tảo",
            "code": 611,
            "codename": "phuong_xuan_tao",
            "division_type": "xã",
            "short_codename": "xuan_tao"
          },
          {
            "name": "Phường Minh Khai",
            "code": 613,
            "codename": "phuong_minh_khai",
            "division_type": "xã",
            "short_codename": "minh_khai"
          },
          {
            "name": "Phường Cổ Nhuế 1",
            "code": 616,
            "codename": "phuong_co_nhue_1",
            "division_type": "xã",
            "short_codename": "co_nhue_1"
          },
          {
            "name": "Phường Cổ Nhuế 2",
            "code": 617,
            "codename": "phuong_co_nhue_2",
            "division_type": "xã",
            "short_codename": "co_nhue_2"
          },
          {
            "name": "Phường Phú Diễn",
            "code": 619,
            "codename": "phuong_phu_dien",
            "division_type": "xã",
            "short_codename": "phu_dien"
          },
          {
            "name": "Phường Phúc Diễn",
            "code": 620,
            "codename": "phuong_phuc_dien",
            "division_type": "xã",
            "short_codename": "phuc_dien"
          }
        ]
      },
      {
        "name": "Huyện Mê Linh",
        "code": 250,
        "codename": "huyen_me_linh",
        "division_type": "huyện",
        "short_codename": "me_linh",
        "wards": [
          {
            "name": "Thị trấn Chi Đông",
            "code": 8973,
            "codename": "thi_tran_chi_dong",
            "division_type": "xã",
            "short_codename": "chi_dong"
          },
          {
            "name": "Xã Đại Thịnh",
            "code": 8974,
            "codename": "xa_dai_thinh",
            "division_type": "xã",
            "short_codename": "dai_thinh"
          },
          {
            "name": "Xã Kim Hoa",
            "code": 8977,
            "codename": "xa_kim_hoa",
            "division_type": "xã",
            "short_codename": "kim_hoa"
          },
          {
            "name": "Xã Thạch Đà",
            "code": 8980,
            "codename": "xa_thach_da",
            "division_type": "xã",
            "short_codename": "thach_da"
          },
          {
            "name": "Xã Tiến Thắng",
            "code": 8983,
            "codename": "xa_tien_thang",
            "division_type": "xã",
            "short_codename": "tien_thang"
          },
          {
            "name": "Xã Tự Lập",
            "code": 8986,
            "codename": "xa_tu_lap",
            "division_type": "xã",
            "short_codename": "tu_lap"
          },
          {
            "name": "Thị trấn Quang Minh",
            "code": 8989,
            "codename": "thi_tran_quang_minh",
            "division_type": "xã",
            "short_codename": "quang_minh"
          },
          {
            "name": "Xã Thanh Lâm",
            "code": 8992,
            "codename": "xa_thanh_lam",
            "division_type": "xã",
            "short_codename": "thanh_lam"
          },
          {
            "name": "Xã Tam Đồng",
            "code": 8995,
            "codename": "xa_tam_dong",
            "division_type": "xã",
            "short_codename": "tam_dong"
          },
          {
            "name": "Xã Liên Mạc",
            "code": 8998,
            "codename": "xa_lien_mac",
            "division_type": "xã",
            "short_codename": "lien_mac"
          },
          {
            "name": "Xã Chu Phan",
            "code": 9004,
            "codename": "xa_chu_phan",
            "division_type": "xã",
            "short_codename": "chu_phan"
          },
          {
            "name": "Xã Tiến Thịnh",
            "code": 9007,
            "codename": "xa_tien_thinh",
            "division_type": "xã",
            "short_codename": "tien_thinh"
          },
          {
            "name": "Xã Mê Linh",
            "code": 9010,
            "codename": "xa_me_linh",
            "division_type": "xã",
            "short_codename": "me_linh"
          },
          {
            "name": "Xã Văn Khê",
            "code": 9013,
            "codename": "xa_van_khe",
            "division_type": "xã",
            "short_codename": "van_khe"
          },
          {
            "name": "Xã Hoàng Kim",
            "code": 9016,
            "codename": "xa_hoang_kim",
            "division_type": "xã",
            "short_codename": "hoang_kim"
          },
          {
            "name": "Xã Tiền Phong",
            "code": 9019,
            "codename": "xa_tien_phong",
            "division_type": "xã",
            "short_codename": "tien_phong"
          },
          {
            "name": "Xã Tráng Việt",
            "code": 9022,
            "codename": "xa_trang_viet",
            "division_type": "xã",
            "short_codename": "trang_viet"
          }
        ]
      },
      {
        "name": "Quận Hà Đông",
        "code": 268,
        "codename": "quan_ha_dong",
        "division_type": "huyện",
        "short_codename": "ha_dong",
        "wards": [
          {
            "name": "Phường Quang Trung",
            "code": 9538,
            "codename": "phuong_quang_trung",
            "division_type": "xã",
            "short_codename": "quang_trung"
          },
          {
            "name": "Phường Mộ Lao",
            "code": 9541,
            "codename": "phuong_mo_lao",
            "division_type": "xã",
            "short_codename": "mo_lao"
          },
          {
            "name": "Phường Văn Quán",
            "code": 9542,
            "codename": "phuong_van_quan",
            "division_type": "xã",
            "short_codename": "van_quan"
          },
          {
            "name": "Phường Vạn Phúc",
            "code": 9544,
            "codename": "phuong_van_phuc",
            "division_type": "xã",
            "short_codename": "van_phuc"
          },
          {
            "name": "Phường La Khê",
            "code": 9551,
            "codename": "phuong_la_khe",
            "division_type": "xã",
            "short_codename": "la_khe"
          },
          {
            "name": "Phường Phú La",
            "code": 9552,
            "codename": "phuong_phu_la",
            "division_type": "xã",
            "short_codename": "phu_la"
          },
          {
            "name": "Phường Phúc La",
            "code": 9553,
            "codename": "phuong_phuc_la",
            "division_type": "xã",
            "short_codename": "phuc_la"
          },
          {
            "name": "Phường Hà Cầu",
            "code": 9556,
            "codename": "phuong_ha_cau",
            "division_type": "xã",
            "short_codename": "ha_cau"
          },
          {
            "name": "Phường Yên Nghĩa",
            "code": 9562,
            "codename": "phuong_yen_nghia",
            "division_type": "xã",
            "short_codename": "yen_nghia"
          },
          {
            "name": "Phường Kiến Hưng",
            "code": 9565,
            "codename": "phuong_kien_hung",
            "division_type": "xã",
            "short_codename": "kien_hung"
          },
          {
            "name": "Phường Phú Lãm",
            "code": 9568,
            "codename": "phuong_phu_lam",
            "division_type": "xã",
            "short_codename": "phu_lam"
          },
          {
            "name": "Phường Phú Lương",
            "code": 9571,
            "codename": "phuong_phu_luong",
            "division_type": "xã",
            "short_codename": "phu_luong"
          },
          {
            "name": "Phường Dương Nội",
            "code": 9886,
            "codename": "phuong_duong_noi",
            "division_type": "xã",
            "short_codename": "duong_noi"
          },
          {
            "name": "Phường Đồng Mai",
            "code": 10117,
            "codename": "phuong_dong_mai",
            "division_type": "xã",
            "short_codename": "dong_mai"
          },
          {
            "name": "Phường Biên Giang",
            "code": 10123,
            "codename": "phuong_bien_giang",
            "division_type": "xã",
            "short_codename": "bien_giang"
          }
        ]
      },
      {
        "name": "Thị xã Sơn Tây",
        "code": 269,
        "codename": "thi_xa_son_tay",
        "division_type": "huyện",
        "short_codename": "son_tay",
        "wards": [
          {
            "name": "Phường Ngô Quyền",
            "code": 9574,
            "codename": "phuong_ngo_quyen",
            "division_type": "xã",
            "short_codename": "ngo_quyen"
          },
          {
            "name": "Phường Phú Thịnh",
            "code": 9577,
            "codename": "phuong_phu_thinh",
            "division_type": "xã",
            "short_codename": "phu_thinh"
          },
          {
            "name": "Phường Sơn Lộc",
            "code": 9586,
            "codename": "phuong_son_loc",
            "division_type": "xã",
            "short_codename": "son_loc"
          },
          {
            "name": "Phường Xuân Khanh",
            "code": 9589,
            "codename": "phuong_xuan_khanh",
            "division_type": "xã",
            "short_codename": "xuan_khanh"
          },
          {
            "name": "Xã Đường Lâm",
            "code": 9592,
            "codename": "xa_duong_lam",
            "division_type": "xã",
            "short_codename": "duong_lam"
          },
          {
            "name": "Phường Viên Sơn",
            "code": 9595,
            "codename": "phuong_vien_son",
            "division_type": "xã",
            "short_codename": "vien_son"
          },
          {
            "name": "Xã Xuân Sơn",
            "code": 9598,
            "codename": "xa_xuan_son",
            "division_type": "xã",
            "short_codename": "xuan_son"
          },
          {
            "name": "Phường Trung Hưng",
            "code": 9601,
            "codename": "phuong_trung_hung",
            "division_type": "xã",
            "short_codename": "trung_hung"
          },
          {
            "name": "Xã Thanh Mỹ",
            "code": 9604,
            "codename": "xa_thanh_my",
            "division_type": "xã",
            "short_codename": "thanh_my"
          },
          {
            "name": "Phường Trung Sơn Trầm",
            "code": 9607,
            "codename": "phuong_trung_son_tram",
            "division_type": "xã",
            "short_codename": "trung_son_tram"
          },
          {
            "name": "Xã Kim Sơn",
            "code": 9610,
            "codename": "xa_kim_son",
            "division_type": "xã",
            "short_codename": "kim_son"
          },
          {
            "name": "Xã Sơn Đông",
            "code": 9613,
            "codename": "xa_son_dong",
            "division_type": "xã",
            "short_codename": "son_dong"
          },
          {
            "name": "Xã Cổ Đông",
            "code": 9616,
            "codename": "xa_co_dong",
            "division_type": "xã",
            "short_codename": "co_dong"
          }
        ]
      },
      {
        "name": "Huyện Ba Vì",
        "code": 271,
        "codename": "huyen_ba_vi",
        "division_type": "huyện",
        "short_codename": "ba_vi",
        "wards": [
          {
            "name": "Thị trấn Tây Đằng",
            "code": 9619,
            "codename": "thi_tran_tay_dang",
            "division_type": "xã",
            "short_codename": "tay_dang"
          },
          {
            "name": "Xã Phú Cường",
            "code": 9625,
            "codename": "xa_phu_cuong",
            "division_type": "xã",
            "short_codename": "phu_cuong"
          },
          {
            "name": "Xã Cổ Đô",
            "code": 9628,
            "codename": "xa_co_do",
            "division_type": "xã",
            "short_codename": "co_do"
          },
          {
            "name": "Xã Vạn Thắng",
            "code": 9634,
            "codename": "xa_van_thang",
            "division_type": "xã",
            "short_codename": "van_thang"
          },
          {
            "name": "Xã Phong Vân",
            "code": 9640,
            "codename": "xa_phong_van",
            "division_type": "xã",
            "short_codename": "phong_van"
          },
          {
            "name": "Xã Phú Đông",
            "code": 9643,
            "codename": "xa_phu_dong",
            "division_type": "xã",
            "short_codename": "phu_dong"
          },
          {
            "name": "Xã Phú Hồng",
            "code": 9646,
            "codename": "xa_phu_hong",
            "division_type": "xã",
            "short_codename": "phu_hong"
          },
          {
            "name": "Xã Phú Châu",
            "code": 9649,
            "codename": "xa_phu_chau",
            "division_type": "xã",
            "short_codename": "phu_chau"
          },
          {
            "name": "Xã Thái Hòa",
            "code": 9652,
            "codename": "xa_thai_hoa",
            "division_type": "xã",
            "short_codename": "thai_hoa"
          },
          {
            "name": "Xã Đồng Thái",
            "code": 9655,
            "codename": "xa_dong_thai",
            "division_type": "xã",
            "short_codename": "dong_thai"
          },
          {
            "name": "Xã Phú Sơn",
            "code": 9658,
            "codename": "xa_phu_son",
            "division_type": "xã",
            "short_codename": "phu_son"
          },
          {
            "name": "Xã Minh Châu",
            "code": 9661,
            "codename": "xa_minh_chau",
            "division_type": "xã",
            "short_codename": "minh_chau"
          },
          {
            "name": "Xã Vật Lại",
            "code": 9664,
            "codename": "xa_vat_lai",
            "division_type": "xã",
            "short_codename": "vat_lai"
          },
          {
            "name": "Xã Chu Minh",
            "code": 9667,
            "codename": "xa_chu_minh",
            "division_type": "xã",
            "short_codename": "chu_minh"
          },
          {
            "name": "Xã Tòng Bạt",
            "code": 9670,
            "codename": "xa_tong_bat",
            "division_type": "xã",
            "short_codename": "tong_bat"
          },
          {
            "name": "Xã Cẩm Lĩnh",
            "code": 9673,
            "codename": "xa_cam_linh",
            "division_type": "xã",
            "short_codename": "cam_linh"
          },
          {
            "name": "Xã Sơn Đà",
            "code": 9676,
            "codename": "xa_son_da",
            "division_type": "xã",
            "short_codename": "son_da"
          },
          {
            "name": "Xã Đông Quang",
            "code": 9679,
            "codename": "xa_dong_quang",
            "division_type": "xã",
            "short_codename": "dong_quang"
          },
          {
            "name": "Xã Tiên Phong",
            "code": 9682,
            "codename": "xa_tien_phong",
            "division_type": "xã",
            "short_codename": "tien_phong"
          },
          {
            "name": "Xã Thụy An",
            "code": 9685,
            "codename": "xa_thuy_an",
            "division_type": "xã",
            "short_codename": "thuy_an"
          },
          {
            "name": "Xã Cam Thượng",
            "code": 9688,
            "codename": "xa_cam_thuong",
            "division_type": "xã",
            "short_codename": "cam_thuong"
          },
          {
            "name": "Xã Thuần Mỹ",
            "code": 9691,
            "codename": "xa_thuan_my",
            "division_type": "xã",
            "short_codename": "thuan_my"
          },
          {
            "name": "Xã Tản Lĩnh",
            "code": 9694,
            "codename": "xa_tan_linh",
            "division_type": "xã",
            "short_codename": "tan_linh"
          },
          {
            "name": "Xã Ba Trại",
            "code": 9697,
            "codename": "xa_ba_trai",
            "division_type": "xã",
            "short_codename": "ba_trai"
          },
          {
            "name": "Xã Minh Quang",
            "code": 9700,
            "codename": "xa_minh_quang",
            "division_type": "xã",
            "short_codename": "minh_quang"
          },
          {
            "name": "Xã Ba Vì",
            "code": 9703,
            "codename": "xa_ba_vi",
            "division_type": "xã",
            "short_codename": "ba_vi"
          },
          {
            "name": "Xã Vân Hòa",
            "code": 9706,
            "codename": "xa_van_hoa",
            "division_type": "xã",
            "short_codename": "van_hoa"
          },
          {
            "name": "Xã Yên Bài",
            "code": 9709,
            "codename": "xa_yen_bai",
            "division_type": "xã",
            "short_codename": "yen_bai"
          },
          {
            "name": "Xã Khánh Thượng",
            "code": 9712,
            "codename": "xa_khanh_thuong",
            "division_type": "xã",
            "short_codename": "khanh_thuong"
          }
        ]
      },
      {
        "name": "Huyện Phúc Thọ",
        "code": 272,
        "codename": "huyen_phuc_tho",
        "division_type": "huyện",
        "short_codename": "phuc_tho",
        "wards": [
          {
            "name": "Thị trấn Phúc Thọ",
            "code": 9715,
            "codename": "thi_tran_phuc_tho",
            "division_type": "xã",
            "short_codename": "phuc_tho"
          },
          {
            "name": "Xã Vân Phúc",
            "code": 9721,
            "codename": "xa_van_phuc",
            "division_type": "xã",
            "short_codename": "van_phuc"
          },
          {
            "name": "Xã Nam Hà",
            "code": 9724,
            "codename": "xa_nam_ha",
            "division_type": "xã",
            "short_codename": "nam_ha"
          },
          {
            "name": "Xã Xuân Đình",
            "code": 9727,
            "codename": "xa_xuan_dinh",
            "division_type": "xã",
            "short_codename": "xuan_dinh"
          },
          {
            "name": "Xã Sen Phương",
            "code": 9733,
            "codename": "xa_sen_phuong",
            "division_type": "xã",
            "short_codename": "sen_phuong"
          },
          {
            "name": "Xã Võng Xuyên",
            "code": 9739,
            "codename": "xa_vong_xuyen",
            "division_type": "xã",
            "short_codename": "vong_xuyen"
          },
          {
            "name": "Xã Tích Lộc",
            "code": 9742,
            "codename": "xa_tich_loc",
            "division_type": "xã",
            "short_codename": "tich_loc"
          },
          {
            "name": "Xã Long Thượng",
            "code": 9745,
            "codename": "xa_long_thuong",
            "division_type": "xã",
            "short_codename": "long_thuong"
          },
          {
            "name": "Xã Hát Môn",
            "code": 9751,
            "codename": "xa_hat_mon",
            "division_type": "xã",
            "short_codename": "hat_mon"
          },
          {
            "name": "Xã Thanh Đa",
            "code": 9757,
            "codename": "xa_thanh_da",
            "division_type": "xã",
            "short_codename": "thanh_da"
          },
          {
            "name": "Xã Trạch Mỹ Lộc",
            "code": 9760,
            "codename": "xa_trach_my_loc",
            "division_type": "xã",
            "short_codename": "trach_my_loc"
          },
          {
            "name": "Xã Phúc Hòa",
            "code": 9763,
            "codename": "xa_phuc_hoa",
            "division_type": "xã",
            "short_codename": "phuc_hoa"
          },
          {
            "name": "Xã Ngọc Tảo",
            "code": 9766,
            "codename": "xa_ngoc_tao",
            "division_type": "xã",
            "short_codename": "ngoc_tao"
          },
          {
            "name": "Xã Phụng Thượng",
            "code": 9769,
            "codename": "xa_phung_thuong",
            "division_type": "xã",
            "short_codename": "phung_thuong"
          },
          {
            "name": "Xã Tam Thuấn",
            "code": 9772,
            "codename": "xa_tam_thuan",
            "division_type": "xã",
            "short_codename": "tam_thuan"
          },
          {
            "name": "Xã Tam Hiệp",
            "code": 9775,
            "codename": "xa_tam_hiep",
            "division_type": "xã",
            "short_codename": "tam_hiep"
          },
          {
            "name": "Xã Hiệp Thuận",
            "code": 9778,
            "codename": "xa_hiep_thuan",
            "division_type": "xã",
            "short_codename": "hiep_thuan"
          },
          {
            "name": "Xã Liên Hiệp",
            "code": 9781,
            "codename": "xa_lien_hiep",
            "division_type": "xã",
            "short_codename": "lien_hiep"
          }
        ]
      },
      {
        "name": "Huyện Đan Phượng",
        "code": 273,
        "codename": "huyen_dan_phuong",
        "division_type": "huyện",
        "short_codename": "dan_phuong",
        "wards": [
          {
            "name": "Thị trấn Phùng",
            "code": 9784,
            "codename": "thi_tran_phung",
            "division_type": "xã",
            "short_codename": "phung"
          },
          {
            "name": "Xã Trung Châu",
            "code": 9787,
            "codename": "xa_trung_chau",
            "division_type": "xã",
            "short_codename": "trung_chau"
          },
          {
            "name": "Xã Thọ An",
            "code": 9790,
            "codename": "xa_tho_an",
            "division_type": "xã",
            "short_codename": "tho_an"
          },
          {
            "name": "Xã Thọ Xuân",
            "code": 9793,
            "codename": "xa_tho_xuan",
            "division_type": "xã",
            "short_codename": "tho_xuan"
          },
          {
            "name": "Xã Hồng Hà",
            "code": 9796,
            "codename": "xa_hong_ha",
            "division_type": "xã",
            "short_codename": "hong_ha"
          },
          {
            "name": "Xã Liên Hồng",
            "code": 9799,
            "codename": "xa_lien_hong",
            "division_type": "xã",
            "short_codename": "lien_hong"
          },
          {
            "name": "Xã Liên Hà",
            "code": 9802,
            "codename": "xa_lien_ha",
            "division_type": "xã",
            "short_codename": "lien_ha"
          },
          {
            "name": "Xã Hạ Mỗ",
            "code": 9805,
            "codename": "xa_ha_mo",
            "division_type": "xã",
            "short_codename": "ha_mo"
          },
          {
            "name": "Xã Liên Trung",
            "code": 9808,
            "codename": "xa_lien_trung",
            "division_type": "xã",
            "short_codename": "lien_trung"
          },
          {
            "name": "Xã Phương Đình",
            "code": 9811,
            "codename": "xa_phuong_dinh",
            "division_type": "xã",
            "short_codename": "phuong_dinh"
          },
          {
            "name": "Xã Thượng Mỗ",
            "code": 9814,
            "codename": "xa_thuong_mo",
            "division_type": "xã",
            "short_codename": "thuong_mo"
          },
          {
            "name": "Xã Tân Hội",
            "code": 9817,
            "codename": "xa_tan_hoi",
            "division_type": "xã",
            "short_codename": "tan_hoi"
          },
          {
            "name": "Xã Tân Lập",
            "code": 9820,
            "codename": "xa_tan_lap",
            "division_type": "xã",
            "short_codename": "tan_lap"
          },
          {
            "name": "Xã Đan Phượng",
            "code": 9823,
            "codename": "xa_dan_phuong",
            "division_type": "xã",
            "short_codename": "dan_phuong"
          },
          {
            "name": "Xã Đồng Tháp",
            "code": 9826,
            "codename": "xa_dong_thap",
            "division_type": "xã",
            "short_codename": "dong_thap"
          },
          {
            "name": "Xã Song Phượng",
            "code": 9829,
            "codename": "xa_song_phuong",
            "division_type": "xã",
            "short_codename": "song_phuong"
          }
        ]
      },
      {
        "name": "Huyện Hoài Đức",
        "code": 274,
        "codename": "huyen_hoai_duc",
        "division_type": "huyện",
        "short_codename": "hoai_duc",
        "wards": [
          {
            "name": "Thị trấn Trạm Trôi",
            "code": 9832,
            "codename": "thi_tran_tram_troi",
            "division_type": "xã",
            "short_codename": "tram_troi"
          },
          {
            "name": "Xã Đức Thượng",
            "code": 9835,
            "codename": "xa_duc_thuong",
            "division_type": "xã",
            "short_codename": "duc_thuong"
          },
          {
            "name": "Xã Minh Khai",
            "code": 9838,
            "codename": "xa_minh_khai",
            "division_type": "xã",
            "short_codename": "minh_khai"
          },
          {
            "name": "Xã Dương Liễu",
            "code": 9841,
            "codename": "xa_duong_lieu",
            "division_type": "xã",
            "short_codename": "duong_lieu"
          },
          {
            "name": "Xã Di Trạch",
            "code": 9844,
            "codename": "xa_di_trach",
            "division_type": "xã",
            "short_codename": "di_trach"
          },
          {
            "name": "Xã Đức Giang",
            "code": 9847,
            "codename": "xa_duc_giang",
            "division_type": "xã",
            "short_codename": "duc_giang"
          },
          {
            "name": "Xã Cát Quế",
            "code": 9850,
            "codename": "xa_cat_que",
            "division_type": "xã",
            "short_codename": "cat_que"
          },
          {
            "name": "Xã Kim Chung",
            "code": 9853,
            "codename": "xa_kim_chung",
            "division_type": "xã",
            "short_codename": "kim_chung"
          },
          {
            "name": "Xã Yên Sở",
            "code": 9856,
            "codename": "xa_yen_so",
            "division_type": "xã",
            "short_codename": "yen_so"
          },
          {
            "name": "Xã Sơn Đồng",
            "code": 9859,
            "codename": "xa_son_dong",
            "division_type": "xã",
            "short_codename": "son_dong"
          },
          {
            "name": "Xã Vân Canh",
            "code": 9862,
            "codename": "xa_van_canh",
            "division_type": "xã",
            "short_codename": "van_canh"
          },
          {
            "name": "Xã Đắc Sở",
            "code": 9865,
            "codename": "xa_dac_so",
            "division_type": "xã",
            "short_codename": "dac_so"
          },
          {
            "name": "Xã Lại Yên",
            "code": 9868,
            "codename": "xa_lai_yen",
            "division_type": "xã",
            "short_codename": "lai_yen"
          },
          {
            "name": "Xã Tiền Yên",
            "code": 9871,
            "codename": "xa_tien_yen",
            "division_type": "xã",
            "short_codename": "tien_yen"
          },
          {
            "name": "Xã Song Phương",
            "code": 9874,
            "codename": "xa_song_phuong",
            "division_type": "xã",
            "short_codename": "song_phuong"
          },
          {
            "name": "Xã An Khánh",
            "code": 9877,
            "codename": "xa_an_khanh",
            "division_type": "xã",
            "short_codename": "an_khanh"
          },
          {
            "name": "Xã An Thượng",
            "code": 9880,
            "codename": "xa_an_thuong",
            "division_type": "xã",
            "short_codename": "an_thuong"
          },
          {
            "name": "Xã Vân Côn",
            "code": 9883,
            "codename": "xa_van_con",
            "division_type": "xã",
            "short_codename": "van_con"
          },
          {
            "name": "Xã La Phù",
            "code": 9889,
            "codename": "xa_la_phu",
            "division_type": "xã",
            "short_codename": "la_phu"
          },
          {
            "name": "Xã Đông La",
            "code": 9892,
            "codename": "xa_dong_la",
            "division_type": "xã",
            "short_codename": "dong_la"
          }
        ]
      },
      {
        "name": "Huyện Quốc Oai",
        "code": 275,
        "codename": "huyen_quoc_oai",
        "division_type": "huyện",
        "short_codename": "quoc_oai",
        "wards": [
          {
            "name": "Xã Đông Xuân",
            "code": 4939,
            "codename": "xa_dong_xuan",
            "division_type": "xã",
            "short_codename": "dong_xuan"
          },
          {
            "name": "Thị trấn Quốc Oai",
            "code": 9895,
            "codename": "thi_tran_quoc_oai",
            "division_type": "xã",
            "short_codename": "quoc_oai"
          },
          {
            "name": "Xã Sài Sơn",
            "code": 9898,
            "codename": "xa_sai_son",
            "division_type": "xã",
            "short_codename": "sai_son"
          },
          {
            "name": "Xã Phượng Sơn",
            "code": 9904,
            "codename": "xa_phuong_son",
            "division_type": "xã",
            "short_codename": "phuong_son"
          },
          {
            "name": "Xã Ngọc Liệp",
            "code": 9907,
            "codename": "xa_ngoc_liep",
            "division_type": "xã",
            "short_codename": "ngoc_liep"
          },
          {
            "name": "Xã Ngọc Mỹ",
            "code": 9910,
            "codename": "xa_ngoc_my",
            "division_type": "xã",
            "short_codename": "ngoc_my"
          },
          {
            "name": "Xã Thạch Thán",
            "code": 9916,
            "codename": "xa_thach_than",
            "division_type": "xã",
            "short_codename": "thach_than"
          },
          {
            "name": "Xã Đồng Quang",
            "code": 9919,
            "codename": "xa_dong_quang",
            "division_type": "xã",
            "short_codename": "dong_quang"
          },
          {
            "name": "Xã Phú Cát",
            "code": 9922,
            "codename": "xa_phu_cat",
            "division_type": "xã",
            "short_codename": "phu_cat"
          },
          {
            "name": "Xã Tuyết Nghĩa",
            "code": 9925,
            "codename": "xa_tuyet_nghia",
            "division_type": "xã",
            "short_codename": "tuyet_nghia"
          },
          {
            "name": "Xã Liệp Nghĩa",
            "code": 9928,
            "codename": "xa_liep_nghia",
            "division_type": "xã",
            "short_codename": "liep_nghia"
          },
          {
            "name": "Xã Cộng Hòa",
            "code": 9931,
            "codename": "xa_cong_hoa",
            "division_type": "xã",
            "short_codename": "cong_hoa"
          },
          {
            "name": "Xã Hưng Đạo",
            "code": 9934,
            "codename": "xa_hung_dao",
            "division_type": "xã",
            "short_codename": "hung_dao"
          },
          {
            "name": "Xã Phú Mãn",
            "code": 9940,
            "codename": "xa_phu_man",
            "division_type": "xã",
            "short_codename": "phu_man"
          },
          {
            "name": "Xã Cấn Hữu",
            "code": 9943,
            "codename": "xa_can_huu",
            "division_type": "xã",
            "short_codename": "can_huu"
          },
          {
            "name": "Xã Hòa Thạch",
            "code": 9949,
            "codename": "xa_hoa_thach",
            "division_type": "xã",
            "short_codename": "hoa_thach"
          },
          {
            "name": "Xã Đông Yên",
            "code": 9952,
            "codename": "xa_dong_yen",
            "division_type": "xã",
            "short_codename": "dong_yen"
          }
        ]
      },
      {
        "name": "Huyện Thạch Thất",
        "code": 276,
        "codename": "huyen_thach_that",
        "division_type": "huyện",
        "short_codename": "thach_that",
        "wards": [
          {
            "name": "Xã Yên Trung",
            "code": 4927,
            "codename": "xa_yen_trung",
            "division_type": "xã",
            "short_codename": "yen_trung"
          },
          {
            "name": "Xã Yên Bình",
            "code": 4930,
            "codename": "xa_yen_binh",
            "division_type": "xã",
            "short_codename": "yen_binh"
          },
          {
            "name": "Xã Tiến Xuân",
            "code": 4936,
            "codename": "xa_tien_xuan",
            "division_type": "xã",
            "short_codename": "tien_xuan"
          },
          {
            "name": "Thị trấn Liên Quan",
            "code": 9955,
            "codename": "thi_tran_lien_quan",
            "division_type": "xã",
            "short_codename": "lien_quan"
          },
          {
            "name": "Xã Đại Đồng",
            "code": 9958,
            "codename": "xa_dai_dong",
            "division_type": "xã",
            "short_codename": "dai_dong"
          },
          {
            "name": "Xã Cẩm Yên",
            "code": 9961,
            "codename": "xa_cam_yen",
            "division_type": "xã",
            "short_codename": "cam_yen"
          },
          {
            "name": "Xã Lại Thượng",
            "code": 9964,
            "codename": "xa_lai_thuong",
            "division_type": "xã",
            "short_codename": "lai_thuong"
          },
          {
            "name": "Xã Phú Kim",
            "code": 9967,
            "codename": "xa_phu_kim",
            "division_type": "xã",
            "short_codename": "phu_kim"
          },
          {
            "name": "Xã Hương Ngải",
            "code": 9970,
            "codename": "xa_huong_ngai",
            "division_type": "xã",
            "short_codename": "huong_ngai"
          },
          {
            "name": "Xã Lam Sơn",
            "code": 9973,
            "codename": "xa_lam_son",
            "division_type": "xã",
            "short_codename": "lam_son"
          },
          {
            "name": "Xã Kim Quan",
            "code": 9976,
            "codename": "xa_kim_quan",
            "division_type": "xã",
            "short_codename": "kim_quan"
          },
          {
            "name": "Xã Bình Yên",
            "code": 9982,
            "codename": "xa_binh_yen",
            "division_type": "xã",
            "short_codename": "binh_yen"
          },
          {
            "name": "Xã Thạch Hoà",
            "code": 9988,
            "codename": "xa_thach_hoa",
            "division_type": "xã",
            "short_codename": "thach_hoa"
          },
          {
            "name": "Xã Cần Kiệm",
            "code": 9991,
            "codename": "xa_can_kiem",
            "division_type": "xã",
            "short_codename": "can_kiem"
          },
          {
            "name": "Xã Phùng Xá",
            "code": 9997,
            "codename": "xa_phung_xa",
            "division_type": "xã",
            "short_codename": "phung_xa"
          },
          {
            "name": "Xã Tân Xã",
            "code": 10000,
            "codename": "xa_tan_xa",
            "division_type": "xã",
            "short_codename": "tan_xa"
          },
          {
            "name": "Xã Thạch Xá",
            "code": 10003,
            "codename": "xa_thach_xa",
            "division_type": "xã",
            "short_codename": "thach_xa"
          },
          {
            "name": "Xã Quang Trung",
            "code": 10006,
            "codename": "xa_quang_trung",
            "division_type": "xã",
            "short_codename": "quang_trung"
          },
          {
            "name": "Xã Hạ Bằng",
            "code": 10009,
            "codename": "xa_ha_bang",
            "division_type": "xã",
            "short_codename": "ha_bang"
          },
          {
            "name": "Xã Đồng Trúc",
            "code": 10012,
            "codename": "xa_dong_truc",
            "division_type": "xã",
            "short_codename": "dong_truc"
          }
        ]
      },
      {
        "name": "Huyện Chương Mỹ",
        "code": 277,
        "codename": "huyen_chuong_my",
        "division_type": "huyện",
        "short_codename": "chuong_my",
        "wards": [
          {
            "name": "Thị trấn Chúc Sơn",
            "code": 10015,
            "codename": "thi_tran_chuc_son",
            "division_type": "xã",
            "short_codename": "chuc_son"
          },
          {
            "name": "Thị trấn Xuân Mai",
            "code": 10018,
            "codename": "thi_tran_xuan_mai",
            "division_type": "xã",
            "short_codename": "xuan_mai"
          },
          {
            "name": "Xã Phụng Châu",
            "code": 10021,
            "codename": "xa_phung_chau",
            "division_type": "xã",
            "short_codename": "phung_chau"
          },
          {
            "name": "Xã Tiên Phương",
            "code": 10024,
            "codename": "xa_tien_phuong",
            "division_type": "xã",
            "short_codename": "tien_phuong"
          },
          {
            "name": "Xã Đông Sơn",
            "code": 10027,
            "codename": "xa_dong_son",
            "division_type": "xã",
            "short_codename": "dong_son"
          },
          {
            "name": "Xã Đông Phương Yên",
            "code": 10030,
            "codename": "xa_dong_phuong_yen",
            "division_type": "xã",
            "short_codename": "dong_phuong_yen"
          },
          {
            "name": "Xã Phú Nghĩa",
            "code": 10033,
            "codename": "xa_phu_nghia",
            "division_type": "xã",
            "short_codename": "phu_nghia"
          },
          {
            "name": "Xã Trường Yên",
            "code": 10039,
            "codename": "xa_truong_yen",
            "division_type": "xã",
            "short_codename": "truong_yen"
          },
          {
            "name": "Xã Ngọc Hòa",
            "code": 10042,
            "codename": "xa_ngoc_hoa",
            "division_type": "xã",
            "short_codename": "ngoc_hoa"
          },
          {
            "name": "Xã Thủy Xuân Tiên",
            "code": 10045,
            "codename": "xa_thuy_xuan_tien",
            "division_type": "xã",
            "short_codename": "thuy_xuan_tien"
          },
          {
            "name": "Xã Thanh Bình",
            "code": 10048,
            "codename": "xa_thanh_binh",
            "division_type": "xã",
            "short_codename": "thanh_binh"
          },
          {
            "name": "Xã Trung Hòa",
            "code": 10051,
            "codename": "xa_trung_hoa",
            "division_type": "xã",
            "short_codename": "trung_hoa"
          },
          {
            "name": "Xã Đại Yên",
            "code": 10054,
            "codename": "xa_dai_yen",
            "division_type": "xã",
            "short_codename": "dai_yen"
          },
          {
            "name": "Xã Thụy Hương",
            "code": 10057,
            "codename": "xa_thuy_huong",
            "division_type": "xã",
            "short_codename": "thuy_huong"
          },
          {
            "name": "Xã Tốt Động",
            "code": 10060,
            "codename": "xa_tot_dong",
            "division_type": "xã",
            "short_codename": "tot_dong"
          },
          {
            "name": "Xã Lam Điền",
            "code": 10063,
            "codename": "xa_lam_dien",
            "division_type": "xã",
            "short_codename": "lam_dien"
          },
          {
            "name": "Xã Tân Tiến",
            "code": 10066,
            "codename": "xa_tan_tien",
            "division_type": "xã",
            "short_codename": "tan_tien"
          },
          {
            "name": "Xã Nam Phương Tiến",
            "code": 10069,
            "codename": "xa_nam_phuong_tien",
            "division_type": "xã",
            "short_codename": "nam_phuong_tien"
          },
          {
            "name": "Xã Hợp Đồng",
            "code": 10072,
            "codename": "xa_hop_dong",
            "division_type": "xã",
            "short_codename": "hop_dong"
          },
          {
            "name": "Xã Hoàng Văn Thụ",
            "code": 10075,
            "codename": "xa_hoang_van_thu",
            "division_type": "xã",
            "short_codename": "hoang_van_thu"
          },
          {
            "name": "Xã Hoàng Diệu",
            "code": 10078,
            "codename": "xa_hoang_dieu",
            "division_type": "xã",
            "short_codename": "hoang_dieu"
          },
          {
            "name": "Xã Hữu Văn",
            "code": 10081,
            "codename": "xa_huu_van",
            "division_type": "xã",
            "short_codename": "huu_van"
          },
          {
            "name": "Xã Quảng Bị",
            "code": 10084,
            "codename": "xa_quang_bi",
            "division_type": "xã",
            "short_codename": "quang_bi"
          },
          {
            "name": "Xã Mỹ Lương",
            "code": 10087,
            "codename": "xa_my_luong",
            "division_type": "xã",
            "short_codename": "my_luong"
          },
          {
            "name": "Xã Thượng Vực",
            "code": 10090,
            "codename": "xa_thuong_vuc",
            "division_type": "xã",
            "short_codename": "thuong_vuc"
          },
          {
            "name": "Xã Hồng Phú",
            "code": 10096,
            "codename": "xa_hong_phu",
            "division_type": "xã",
            "short_codename": "hong_phu"
          },
          {
            "name": "Xã Trần Phú",
            "code": 10099,
            "codename": "xa_tran_phu",
            "division_type": "xã",
            "short_codename": "tran_phu"
          },
          {
            "name": "Xã Văn Võ",
            "code": 10102,
            "codename": "xa_van_vo",
            "division_type": "xã",
            "short_codename": "van_vo"
          },
          {
            "name": "Xã Đồng Lạc",
            "code": 10105,
            "codename": "xa_dong_lac",
            "division_type": "xã",
            "short_codename": "dong_lac"
          },
          {
            "name": "Xã Hòa Phú",
            "code": 10108,
            "codename": "xa_hoa_phu",
            "division_type": "xã",
            "short_codename": "hoa_phu"
          }
        ]
      },
      {
        "name": "Huyện Thanh Oai",
        "code": 278,
        "codename": "huyen_thanh_oai",
        "division_type": "huyện",
        "short_codename": "thanh_oai",
        "wards": [
          {
            "name": "Thị trấn Kim Bài",
            "code": 10114,
            "codename": "thi_tran_kim_bai",
            "division_type": "xã",
            "short_codename": "kim_bai"
          },
          {
            "name": "Xã Cự Khê",
            "code": 10120,
            "codename": "xa_cu_khe",
            "division_type": "xã",
            "short_codename": "cu_khe"
          },
          {
            "name": "Xã Bích Hòa",
            "code": 10126,
            "codename": "xa_bich_hoa",
            "division_type": "xã",
            "short_codename": "bich_hoa"
          },
          {
            "name": "Xã Mỹ Hưng",
            "code": 10129,
            "codename": "xa_my_hung",
            "division_type": "xã",
            "short_codename": "my_hung"
          },
          {
            "name": "Xã Cao Viên",
            "code": 10132,
            "codename": "xa_cao_vien",
            "division_type": "xã",
            "short_codename": "cao_vien"
          },
          {
            "name": "Xã Bình Minh",
            "code": 10135,
            "codename": "xa_binh_minh",
            "division_type": "xã",
            "short_codename": "binh_minh"
          },
          {
            "name": "Xã Tam Hưng",
            "code": 10138,
            "codename": "xa_tam_hung",
            "division_type": "xã",
            "short_codename": "tam_hung"
          },
          {
            "name": "Xã Thanh Cao",
            "code": 10141,
            "codename": "xa_thanh_cao",
            "division_type": "xã",
            "short_codename": "thanh_cao"
          },
          {
            "name": "Xã Thanh Thùy",
            "code": 10144,
            "codename": "xa_thanh_thuy",
            "division_type": "xã",
            "short_codename": "thanh_thuy"
          },
          {
            "name": "Xã Thanh Mai",
            "code": 10147,
            "codename": "xa_thanh_mai",
            "division_type": "xã",
            "short_codename": "thanh_mai"
          },
          {
            "name": "Xã Thanh Văn",
            "code": 10150,
            "codename": "xa_thanh_van",
            "division_type": "xã",
            "short_codename": "thanh_van"
          },
          {
            "name": "Xã Đỗ Động",
            "code": 10153,
            "codename": "xa_do_dong",
            "division_type": "xã",
            "short_codename": "do_dong"
          },
          {
            "name": "Xã Kim An",
            "code": 10156,
            "codename": "xa_kim_an",
            "division_type": "xã",
            "short_codename": "kim_an"
          },
          {
            "name": "Xã Kim Thư",
            "code": 10159,
            "codename": "xa_kim_thu",
            "division_type": "xã",
            "short_codename": "kim_thu"
          },
          {
            "name": "Xã Phương Trung",
            "code": 10162,
            "codename": "xa_phuong_trung",
            "division_type": "xã",
            "short_codename": "phuong_trung"
          },
          {
            "name": "Xã Tân Ước",
            "code": 10165,
            "codename": "xa_tan_uoc",
            "division_type": "xã",
            "short_codename": "tan_uoc"
          },
          {
            "name": "Xã Dân Hòa",
            "code": 10168,
            "codename": "xa_dan_hoa",
            "division_type": "xã",
            "short_codename": "dan_hoa"
          },
          {
            "name": "Xã Liên Châu",
            "code": 10171,
            "codename": "xa_lien_chau",
            "division_type": "xã",
            "short_codename": "lien_chau"
          },
          {
            "name": "Xã Cao Xuân Dương",
            "code": 10174,
            "codename": "xa_cao_xuan_duong",
            "division_type": "xã",
            "short_codename": "cao_xuan_duong"
          },
          {
            "name": "Xã Hồng Dương",
            "code": 10180,
            "codename": "xa_hong_duong",
            "division_type": "xã",
            "short_codename": "hong_duong"
          }
        ]
      },
      {
        "name": "Huyện Thường Tín",
        "code": 279,
        "codename": "huyen_thuong_tin",
        "division_type": "huyện",
        "short_codename": "thuong_tin",
        "wards": [
          {
            "name": "Thị trấn Thường Tín",
            "code": 10183,
            "codename": "thi_tran_thuong_tin",
            "division_type": "xã",
            "short_codename": "thuong_tin"
          },
          {
            "name": "Xã Ninh Sở",
            "code": 10186,
            "codename": "xa_ninh_so",
            "division_type": "xã",
            "short_codename": "ninh_so"
          },
          {
            "name": "Xã Nhị Khê",
            "code": 10189,
            "codename": "xa_nhi_khe",
            "division_type": "xã",
            "short_codename": "nhi_khe"
          },
          {
            "name": "Xã Duyên Thái",
            "code": 10192,
            "codename": "xa_duyen_thai",
            "division_type": "xã",
            "short_codename": "duyen_thai"
          },
          {
            "name": "Xã Khánh Hà",
            "code": 10195,
            "codename": "xa_khanh_ha",
            "division_type": "xã",
            "short_codename": "khanh_ha"
          },
          {
            "name": "Xã Hòa Bình",
            "code": 10198,
            "codename": "xa_hoa_binh",
            "division_type": "xã",
            "short_codename": "hoa_binh"
          },
          {
            "name": "Xã Văn Bình",
            "code": 10201,
            "codename": "xa_van_binh",
            "division_type": "xã",
            "short_codename": "van_binh"
          },
          {
            "name": "Xã Hiền Giang",
            "code": 10204,
            "codename": "xa_hien_giang",
            "division_type": "xã",
            "short_codename": "hien_giang"
          },
          {
            "name": "Xã Hồng Vân",
            "code": 10207,
            "codename": "xa_hong_van",
            "division_type": "xã",
            "short_codename": "hong_van"
          },
          {
            "name": "Xã Vân Tảo",
            "code": 10210,
            "codename": "xa_van_tao",
            "division_type": "xã",
            "short_codename": "van_tao"
          },
          {
            "name": "Xã Liên Phương",
            "code": 10213,
            "codename": "xa_lien_phuong",
            "division_type": "xã",
            "short_codename": "lien_phuong"
          },
          {
            "name": "Xã Văn Phú",
            "code": 10216,
            "codename": "xa_van_phu",
            "division_type": "xã",
            "short_codename": "van_phu"
          },
          {
            "name": "Xã Tự Nhiên",
            "code": 10219,
            "codename": "xa_tu_nhien",
            "division_type": "xã",
            "short_codename": "tu_nhien"
          },
          {
            "name": "Xã Tiền Phong",
            "code": 10222,
            "codename": "xa_tien_phong",
            "division_type": "xã",
            "short_codename": "tien_phong"
          },
          {
            "name": "Xã Hà Hồi",
            "code": 10225,
            "codename": "xa_ha_hoi",
            "division_type": "xã",
            "short_codename": "ha_hoi"
          },
          {
            "name": "Xã Nguyễn Trãi",
            "code": 10231,
            "codename": "xa_nguyen_trai",
            "division_type": "xã",
            "short_codename": "nguyen_trai"
          },
          {
            "name": "Xã Quất Động",
            "code": 10234,
            "codename": "xa_quat_dong",
            "division_type": "xã",
            "short_codename": "quat_dong"
          },
          {
            "name": "Xã Chương Dương",
            "code": 10237,
            "codename": "xa_chuong_duong",
            "division_type": "xã",
            "short_codename": "chuong_duong"
          },
          {
            "name": "Xã Tân Minh",
            "code": 10240,
            "codename": "xa_tan_minh",
            "division_type": "xã",
            "short_codename": "tan_minh"
          },
          {
            "name": "Xã Lê Lợi",
            "code": 10243,
            "codename": "xa_le_loi",
            "division_type": "xã",
            "short_codename": "le_loi"
          },
          {
            "name": "Xã Thắng Lợi",
            "code": 10246,
            "codename": "xa_thang_loi",
            "division_type": "xã",
            "short_codename": "thang_loi"
          },
          {
            "name": "Xã Dũng Tiến",
            "code": 10249,
            "codename": "xa_dung_tien",
            "division_type": "xã",
            "short_codename": "dung_tien"
          },
          {
            "name": "Xã Nghiêm Xuyên",
            "code": 10255,
            "codename": "xa_nghiem_xuyen",
            "division_type": "xã",
            "short_codename": "nghiem_xuyen"
          },
          {
            "name": "Xã Tô Hiệu",
            "code": 10258,
            "codename": "xa_to_hieu",
            "division_type": "xã",
            "short_codename": "to_hieu"
          },
          {
            "name": "Xã Văn Tự",
            "code": 10261,
            "codename": "xa_van_tu",
            "division_type": "xã",
            "short_codename": "van_tu"
          },
          {
            "name": "Xã Vạn Nhất",
            "code": 10264,
            "codename": "xa_van_nhat",
            "division_type": "xã",
            "short_codename": "van_nhat"
          },
          {
            "name": "Xã Minh Cường",
            "code": 10267,
            "codename": "xa_minh_cuong",
            "division_type": "xã",
            "short_codename": "minh_cuong"
          }
        ]
      },
      {
        "name": "Huyện Phú Xuyên",
        "code": 280,
        "codename": "huyen_phu_xuyen",
        "division_type": "huyện",
        "short_codename": "phu_xuyen",
        "wards": [
          {
            "name": "Thị trấn Phú Minh",
            "code": 10270,
            "codename": "thi_tran_phu_minh",
            "division_type": "xã",
            "short_codename": "phu_minh"
          },
          {
            "name": "Thị trấn Phú Xuyên",
            "code": 10273,
            "codename": "thi_tran_phu_xuyen",
            "division_type": "xã",
            "short_codename": "phu_xuyen"
          },
          {
            "name": "Xã Hồng Minh",
            "code": 10276,
            "codename": "xa_hong_minh",
            "division_type": "xã",
            "short_codename": "hong_minh"
          },
          {
            "name": "Xã Phượng Dực",
            "code": 10279,
            "codename": "xa_phuong_duc",
            "division_type": "xã",
            "short_codename": "phuong_duc"
          },
          {
            "name": "Xã Nam Tiến",
            "code": 10282,
            "codename": "xa_nam_tien",
            "division_type": "xã",
            "short_codename": "nam_tien"
          },
          {
            "name": "Xã Văn Hoàng",
            "code": 10291,
            "codename": "xa_van_hoang",
            "division_type": "xã",
            "short_codename": "van_hoang"
          },
          {
            "name": "Xã Phú Túc",
            "code": 10294,
            "codename": "xa_phu_tuc",
            "division_type": "xã",
            "short_codename": "phu_tuc"
          },
          {
            "name": "Xã Hồng Thái",
            "code": 10300,
            "codename": "xa_hong_thai",
            "division_type": "xã",
            "short_codename": "hong_thai"
          },
          {
            "name": "Xã Hoàng Long",
            "code": 10303,
            "codename": "xa_hoang_long",
            "division_type": "xã",
            "short_codename": "hoang_long"
          },
          {
            "name": "Xã Nam Phong",
            "code": 10312,
            "codename": "xa_nam_phong",
            "division_type": "xã",
            "short_codename": "nam_phong"
          },
          {
            "name": "Xã Tân Dân",
            "code": 10315,
            "codename": "xa_tan_dan",
            "division_type": "xã",
            "short_codename": "tan_dan"
          },
          {
            "name": "Xã Quang Hà",
            "code": 10318,
            "codename": "xa_quang_ha",
            "division_type": "xã",
            "short_codename": "quang_ha"
          },
          {
            "name": "Xã Chuyên Mỹ",
            "code": 10321,
            "codename": "xa_chuyen_my",
            "division_type": "xã",
            "short_codename": "chuyen_my"
          },
          {
            "name": "Xã Khai Thái",
            "code": 10324,
            "codename": "xa_khai_thai",
            "division_type": "xã",
            "short_codename": "khai_thai"
          },
          {
            "name": "Xã Phúc Tiến",
            "code": 10327,
            "codename": "xa_phuc_tien",
            "division_type": "xã",
            "short_codename": "phuc_tien"
          },
          {
            "name": "Xã Vân Từ",
            "code": 10330,
            "codename": "xa_van_tu",
            "division_type": "xã",
            "short_codename": "van_tu"
          },
          {
            "name": "Xã Tri Thủy",
            "code": 10333,
            "codename": "xa_tri_thuy",
            "division_type": "xã",
            "short_codename": "tri_thuy"
          },
          {
            "name": "Xã Đại Xuyên",
            "code": 10336,
            "codename": "xa_dai_xuyen",
            "division_type": "xã",
            "short_codename": "dai_xuyen"
          },
          {
            "name": "Xã Phú Yên",
            "code": 10339,
            "codename": "xa_phu_yen",
            "division_type": "xã",
            "short_codename": "phu_yen"
          },
          {
            "name": "Xã Bạch Hạ",
            "code": 10342,
            "codename": "xa_bach_ha",
            "division_type": "xã",
            "short_codename": "bach_ha"
          },
          {
            "name": "Xã Quang Lãng",
            "code": 10345,
            "codename": "xa_quang_lang",
            "division_type": "xã",
            "short_codename": "quang_lang"
          },
          {
            "name": "Xã Châu Can",
            "code": 10348,
            "codename": "xa_chau_can",
            "division_type": "xã",
            "short_codename": "chau_can"
          },
          {
            "name": "Xã Minh Tân",
            "code": 10351,
            "codename": "xa_minh_tan",
            "division_type": "xã",
            "short_codename": "minh_tan"
          }
        ]
      },
      {
        "name": "Huyện Ứng Hòa",
        "code": 281,
        "codename": "huyen_ung_hoa",
        "division_type": "huyện",
        "short_codename": "ung_hoa",
        "wards": [
          {
            "name": "Thị trấn Vân Đình",
            "code": 10354,
            "codename": "thi_tran_van_dinh",
            "division_type": "xã",
            "short_codename": "van_dinh"
          },
          {
            "name": "Xã Hoa Viên",
            "code": 10363,
            "codename": "xa_hoa_vien",
            "division_type": "xã",
            "short_codename": "hoa_vien"
          },
          {
            "name": "Xã Quảng Phú Cầu",
            "code": 10366,
            "codename": "xa_quang_phu_cau",
            "division_type": "xã",
            "short_codename": "quang_phu_cau"
          },
          {
            "name": "Xã Trường Thịnh",
            "code": 10369,
            "codename": "xa_truong_thinh",
            "division_type": "xã",
            "short_codename": "truong_thinh"
          },
          {
            "name": "Xã Liên Bạt",
            "code": 10375,
            "codename": "xa_lien_bat",
            "division_type": "xã",
            "short_codename": "lien_bat"
          },
          {
            "name": "Xã Cao Sơn Tiến",
            "code": 10378,
            "codename": "xa_cao_son_tien",
            "division_type": "xã",
            "short_codename": "cao_son_tien"
          },
          {
            "name": "Xã Phương Tú",
            "code": 10384,
            "codename": "xa_phuong_tu",
            "division_type": "xã",
            "short_codename": "phuong_tu"
          },
          {
            "name": "Xã Trung Tú",
            "code": 10387,
            "codename": "xa_trung_tu",
            "division_type": "xã",
            "short_codename": "trung_tu"
          },
          {
            "name": "Xã Đồng Tân",
            "code": 10390,
            "codename": "xa_dong_tan",
            "division_type": "xã",
            "short_codename": "dong_tan"
          },
          {
            "name": "Xã Tảo Dương Văn",
            "code": 10393,
            "codename": "xa_tao_duong_van",
            "division_type": "xã",
            "short_codename": "tao_duong_van"
          },
          {
            "name": "Xã Thái Hòa",
            "code": 10396,
            "codename": "xa_thai_hoa",
            "division_type": "xã",
            "short_codename": "thai_hoa"
          },
          {
            "name": "Xã Minh Đức",
            "code": 10399,
            "codename": "xa_minh_duc",
            "division_type": "xã",
            "short_codename": "minh_duc"
          },
          {
            "name": "Xã Trầm Lộng",
            "code": 10402,
            "codename": "xa_tram_long",
            "division_type": "xã",
            "short_codename": "tram_long"
          },
          {
            "name": "Xã Kim Đường",
            "code": 10411,
            "codename": "xa_kim_duong",
            "division_type": "xã",
            "short_codename": "kim_duong"
          },
          {
            "name": "Xã Hòa Phú",
            "code": 10417,
            "codename": "xa_hoa_phu",
            "division_type": "xã",
            "short_codename": "hoa_phu"
          },
          {
            "name": "Xã Đại Hùng",
            "code": 10423,
            "codename": "xa_dai_hung",
            "division_type": "xã",
            "short_codename": "dai_hung"
          },
          {
            "name": "Xã Đông Lỗ",
            "code": 10426,
            "codename": "xa_dong_lo",
            "division_type": "xã",
            "short_codename": "dong_lo"
          },
          {
            "name": "Xã Phù Lưu",
            "code": 10429,
            "codename": "xa_phu_luu",
            "division_type": "xã",
            "short_codename": "phu_luu"
          },
          {
            "name": "Xã Đại Cường",
            "code": 10432,
            "codename": "xa_dai_cuong",
            "division_type": "xã",
            "short_codename": "dai_cuong"
          },
          {
            "name": "Xã Bình Lưu Quang",
            "code": 10435,
            "codename": "xa_binh_luu_quang",
            "division_type": "xã",
            "short_codename": "binh_luu_quang"
          }
        ]
      },
      {
        "name": "Huyện Mỹ Đức",
        "code": 282,
        "codename": "huyen_my_duc",
        "division_type": "huyện",
        "short_codename": "my_duc",
        "wards": [
          {
            "name": "Thị trấn Đại Nghĩa",
            "code": 10441,
            "codename": "thi_tran_dai_nghia",
            "division_type": "xã",
            "short_codename": "dai_nghia"
          },
          {
            "name": "Xã Đồng Tâm",
            "code": 10444,
            "codename": "xa_dong_tam",
            "division_type": "xã",
            "short_codename": "dong_tam"
          },
          {
            "name": "Xã Thượng Lâm",
            "code": 10447,
            "codename": "xa_thuong_lam",
            "division_type": "xã",
            "short_codename": "thuong_lam"
          },
          {
            "name": "Xã Tuy Lai",
            "code": 10450,
            "codename": "xa_tuy_lai",
            "division_type": "xã",
            "short_codename": "tuy_lai"
          },
          {
            "name": "Xã Phúc Lâm",
            "code": 10453,
            "codename": "xa_phuc_lam",
            "division_type": "xã",
            "short_codename": "phuc_lam"
          },
          {
            "name": "Xã Mỹ Xuyên",
            "code": 10459,
            "codename": "xa_my_xuyen",
            "division_type": "xã",
            "short_codename": "my_xuyen"
          },
          {
            "name": "Xã An Mỹ",
            "code": 10462,
            "codename": "xa_an_my",
            "division_type": "xã",
            "short_codename": "an_my"
          },
          {
            "name": "Xã Hồng Sơn",
            "code": 10465,
            "codename": "xa_hong_son",
            "division_type": "xã",
            "short_codename": "hong_son"
          },
          {
            "name": "Xã Lê Thanh",
            "code": 10468,
            "codename": "xa_le_thanh",
            "division_type": "xã",
            "short_codename": "le_thanh"
          },
          {
            "name": "Xã Xuy Xá",
            "code": 10471,
            "codename": "xa_xuy_xa",
            "division_type": "xã",
            "short_codename": "xuy_xa"
          },
          {
            "name": "Xã Phùng Xá",
            "code": 10474,
            "codename": "xa_phung_xa",
            "division_type": "xã",
            "short_codename": "phung_xa"
          },
          {
            "name": "Xã Phù Lưu Tế",
            "code": 10477,
            "codename": "xa_phu_luu_te",
            "division_type": "xã",
            "short_codename": "phu_luu_te"
          },
          {
            "name": "Xã Đại Hưng",
            "code": 10480,
            "codename": "xa_dai_hung",
            "division_type": "xã",
            "short_codename": "dai_hung"
          },
          {
            "name": "Xã Vạn Tín",
            "code": 10483,
            "codename": "xa_van_tin",
            "division_type": "xã",
            "short_codename": "van_tin"
          },
          {
            "name": "Xã Hương Sơn",
            "code": 10489,
            "codename": "xa_huong_son",
            "division_type": "xã",
            "short_codename": "huong_son"
          },
          {
            "name": "Xã Hùng Tiến",
            "code": 10492,
            "codename": "xa_hung_tien",
            "division_type": "xã",
            "short_codename": "hung_tien"
          },
          {
            "name": "Xã An Tiến",
            "code": 10495,
            "codename": "xa_an_tien",
            "division_type": "xã",
            "short_codename": "an_tien"
          },
          {
            "name": "Xã Hợp Tiến",
            "code": 10498,
            "codename": "xa_hop_tien",
            "division_type": "xã",
            "short_codename": "hop_tien"
          },
          {
            "name": "Xã Hợp Thanh",
            "code": 10501,
            "codename": "xa_hop_thanh",
            "division_type": "xã",
            "short_codename": "hop_thanh"
          },
          {
            "name": "Xã An Phú",
            "code": 10504,
            "codename": "xa_an_phu",
            "division_type": "xã",
            "short_codename": "an_phu"
          }
        ]
      }
    ]
  },
  {
    "name": "Tỉnh Hà Giang",
    "code": 2,
    "codename": "tinh_ha_giang",
    "division_type": "tỉnh",
    "phone_code": 219,
    "districts": [
      {
        "name": "Thành phố Hà Giang",
        "code": 24,
        "codename": "thanh_pho_ha_giang",
        "division_type": "huyện",
        "short_codename": "ha_giang",
        "wards": [
          {
            "name": "Phường Quang Trung",
            "code": 688,
            "codename": "phuong_quang_trung",
            "division_type": "xã",
            "short_codename": "quang_trung"
          },
          {
            "name": "Phường Trần Phú",
            "code": 691,
            "codename": "phuong_tran_phu",
            "division_type": "xã",
            "short_codename": "tran_phu"
          },
          {
            "name": "Phường Ngọc Hà",
            "code": 692,
            "codename": "phuong_ngoc_ha",
            "division_type": "xã",
            "short_codename": "ngoc_ha"
          },
          {
            "name": "Phường Nguyễn Trãi",
            "code": 694,
            "codename": "phuong_nguyen_trai",
            "division_type": "xã",
            "short_codename": "nguyen_trai"
          },
          {
            "name": "Phường Minh Khai",
            "code": 697,
            "codename": "phuong_minh_khai",
            "division_type": "xã",
            "short_codename": "minh_khai"
          },
          {
            "name": "Xã Ngọc Đường",
            "code": 700,
            "codename": "xa_ngoc_duong",
            "division_type": "xã",
            "short_codename": "ngoc_duong"
          },
          {
            "name": "Xã Phương Độ",
            "code": 946,
            "codename": "xa_phuong_do",
            "division_type": "xã",
            "short_codename": "phuong_do"
          },
          {
            "name": "Xã Phương Thiện",
            "code": 949,
            "codename": "xa_phuong_thien",
            "division_type": "xã",
            "short_codename": "phuong_thien"
          }
        ]
      },
      {
        "name": "Huyện Đồng Văn",
        "code": 26,
        "codename": "huyen_dong_van",
        "division_type": "huyện",
        "short_codename": "dong_van",
        "wards": [
          {
            "name": "Thị trấn Phó Bảng",
            "code": 712,
            "codename": "thi_tran_pho_bang",
            "division_type": "xã",
            "short_codename": "pho_bang"
          },
          {
            "name": "Xã Lũng Cú",
            "code": 715,
            "codename": "xa_lung_cu",
            "division_type": "xã",
            "short_codename": "lung_cu"
          },
          {
            "name": "Xã Má Lé",
            "code": 718,
            "codename": "xa_ma_le",
            "division_type": "xã",
            "short_codename": "ma_le"
          },
          {
            "name": "Thị trấn Đồng Văn",
            "code": 721,
            "codename": "thi_tran_dong_van",
            "division_type": "xã",
            "short_codename": "dong_van"
          },
          {
            "name": "Xã Lũng Táo",
            "code": 724,
            "codename": "xa_lung_tao",
            "division_type": "xã",
            "short_codename": "lung_tao"
          },
          {
            "name": "Xã Phố Là",
            "code": 727,
            "codename": "xa_pho_la",
            "division_type": "xã",
            "short_codename": "pho_la"
          },
          {
            "name": "Xã Thài Phìn Tủng",
            "code": 730,
            "codename": "xa_thai_phin_tung",
            "division_type": "xã",
            "short_codename": "thai_phin_tung"
          },
          {
            "name": "Xã Sủng Là",
            "code": 733,
            "codename": "xa_sung_la",
            "division_type": "xã",
            "short_codename": "sung_la"
          },
          {
            "name": "Xã Xà Phìn",
            "code": 736,
            "codename": "xa_xa_phin",
            "division_type": "xã",
            "short_codename": "xa_phin"
          },
          {
            "name": "Xã Tả Phìn",
            "code": 739,
            "codename": "xa_ta_phin",
            "division_type": "xã",
            "short_codename": "ta_phin"
          },
          {
            "name": "Xã Tả Lủng",
            "code": 742,
            "codename": "xa_ta_lung",
            "division_type": "xã",
            "short_codename": "ta_lung"
          },
          {
            "name": "Xã Phố Cáo",
            "code": 745,
            "codename": "xa_pho_cao",
            "division_type": "xã",
            "short_codename": "pho_cao"
          },
          {
            "name": "Xã Sính Lủng",
            "code": 748,
            "codename": "xa_sinh_lung",
            "division_type": "xã",
            "short_codename": "sinh_lung"
          },
          {
            "name": "Xã Sảng Tủng",
            "code": 751,
            "codename": "xa_sang_tung",
            "division_type": "xã",
            "short_codename": "sang_tung"
          },
          {
            "name": "Xã Lũng Thầu",
            "code": 754,
            "codename": "xa_lung_thau",
            "division_type": "xã",
            "short_codename": "lung_thau"
          },
          {
            "name": "Xã Hố Quáng Phìn",
            "code": 757,
            "codename": "xa_ho_quang_phin",
            "division_type": "xã",
            "short_codename": "ho_quang_phin"
          },
          {
            "name": "Xã Vần Chải",
            "code": 760,
            "codename": "xa_van_chai",
            "division_type": "xã",
            "short_codename": "van_chai"
          },
          {
            "name": "Xã Lũng Phìn",
            "code": 763,
            "codename": "xa_lung_phin",
            "division_type": "xã",
            "short_codename": "lung_phin"
          },
          {
            "name": "Xã Sủng Trái",
            "code": 766,
            "codename": "xa_sung_trai",
            "division_type": "xã",
            "short_codename": "sung_trai"
          }
        ]
      },
      {
        "name": "Huyện Mèo Vạc",
        "code": 27,
        "codename": "huyen_meo_vac",
        "division_type": "huyện",
        "short_codename": "meo_vac",
        "wards": [
          {
            "name": "Thị trấn Mèo Vạc",
            "code": 769,
            "codename": "thi_tran_meo_vac",
            "division_type": "xã",
            "short_codename": "meo_vac"
          },
          {
            "name": "Xã Thượng Phùng",
            "code": 772,
            "codename": "xa_thuong_phung",
            "division_type": "xã",
            "short_codename": "thuong_phung"
          },
          {
            "name": "Xã Pải Lủng",
            "code": 775,
            "codename": "xa_pai_lung",
            "division_type": "xã",
            "short_codename": "pai_lung"
          },
          {
            "name": "Xã Xín Cái",
            "code": 778,
            "codename": "xa_xin_cai",
            "division_type": "xã",
            "short_codename": "xin_cai"
          },
          {
            "name": "Xã Pả Vi",
            "code": 781,
            "codename": "xa_pa_vi",
            "division_type": "xã",
            "short_codename": "pa_vi"
          },
          {
            "name": "Xã Giàng Chu Phìn",
            "code": 784,
            "codename": "xa_giang_chu_phin",
            "division_type": "xã",
            "short_codename": "giang_chu_phin"
          },
          {
            "name": "Xã Sủng Trà",
            "code": 787,
            "codename": "xa_sung_tra",
            "division_type": "xã",
            "short_codename": "sung_tra"
          },
          {
            "name": "Xã Sủng Máng",
            "code": 790,
            "codename": "xa_sung_mang",
            "division_type": "xã",
            "short_codename": "sung_mang"
          },
          {
            "name": "Xã Sơn Vĩ",
            "code": 793,
            "codename": "xa_son_vi",
            "division_type": "xã",
            "short_codename": "son_vi"
          },
          {
            "name": "Xã Tả Lủng",
            "code": 796,
            "codename": "xa_ta_lung",
            "division_type": "xã",
            "short_codename": "ta_lung"
          },
          {
            "name": "Xã Cán Chu Phìn",
            "code": 799,
            "codename": "xa_can_chu_phin",
            "division_type": "xã",
            "short_codename": "can_chu_phin"
          },
          {
            "name": "Xã Lũng Pù",
            "code": 802,
            "codename": "xa_lung_pu",
            "division_type": "xã",
            "short_codename": "lung_pu"
          },
          {
            "name": "Xã Lũng Chinh",
            "code": 805,
            "codename": "xa_lung_chinh",
            "division_type": "xã",
            "short_codename": "lung_chinh"
          },
          {
            "name": "Xã Tát Ngà",
            "code": 808,
            "codename": "xa_tat_nga",
            "division_type": "xã",
            "short_codename": "tat_nga"
          },
          {
            "name": "Xã Nậm Ban",
            "code": 811,
            "codename": "xa_nam_ban",
            "division_type": "xã",
            "short_codename": "nam_ban"
          },
          {
            "name": "Xã Khâu Vai",
            "code": 814,
            "codename": "xa_khau_vai",
            "division_type": "xã",
            "short_codename": "khau_vai"
          },
          {
            "name": "Xã Niêm Tòng",
            "code": 815,
            "codename": "xa_niem_tong",
            "division_type": "xã",
            "short_codename": "niem_tong"
          },
          {
            "name": "Xã Niêm Sơn",
            "code": 817,
            "codename": "xa_niem_son",
            "division_type": "xã",
            "short_codename": "niem_son"
          }
        ]
      },
      {
        "name": "Huyện Yên Minh",
        "code": 28,
        "codename": "huyen_yen_minh",
        "division_type": "huyện",
        "short_codename": "yen_minh",
        "wards": [
          {
            "name": "Thị trấn Yên Minh",
            "code": 820,
            "codename": "thi_tran_yen_minh",
            "division_type": "xã",
            "short_codename": "yen_minh"
          },
          {
            "name": "Xã Thắng Mố",
            "code": 823,
            "codename": "xa_thang_mo",
            "division_type": "xã",
            "short_codename": "thang_mo"
          },
          {
            "name": "Xã Phú Lũng",
            "code": 826,
            "codename": "xa_phu_lung",
            "division_type": "xã",
            "short_codename": "phu_lung"
          },
          {
            "name": "Xã Sủng Tráng",
            "code": 829,
            "codename": "xa_sung_trang",
            "division_type": "xã",
            "short_codename": "sung_trang"
          },
          {
            "name": "Xã Bạch Đích",
            "code": 832,
            "codename": "xa_bach_dich",
            "division_type": "xã",
            "short_codename": "bach_dich"
          },
          {
            "name": "Xã Na Khê",
            "code": 835,
            "codename": "xa_na_khe",
            "division_type": "xã",
            "short_codename": "na_khe"
          },
          {
            "name": "Xã Sủng Thài",
            "code": 838,
            "codename": "xa_sung_thai",
            "division_type": "xã",
            "short_codename": "sung_thai"
          },
          {
            "name": "Xã Hữu Vinh",
            "code": 841,
            "codename": "xa_huu_vinh",
            "division_type": "xã",
            "short_codename": "huu_vinh"
          },
          {
            "name": "Xã Lao Và Chải",
            "code": 844,
            "codename": "xa_lao_va_chai",
            "division_type": "xã",
            "short_codename": "lao_va_chai"
          },
          {
            "name": "Xã Mậu Duệ",
            "code": 847,
            "codename": "xa_mau_due",
            "division_type": "xã",
            "short_codename": "mau_due"
          },
          {
            "name": "Xã Đông Minh",
            "code": 850,
            "codename": "xa_dong_minh",
            "division_type": "xã",
            "short_codename": "dong_minh"
          },
          {
            "name": "Xã Mậu Long",
            "code": 853,
            "codename": "xa_mau_long",
            "division_type": "xã",
            "short_codename": "mau_long"
          },
          {
            "name": "Xã Ngam La",
            "code": 856,
            "codename": "xa_ngam_la",
            "division_type": "xã",
            "short_codename": "ngam_la"
          },
          {
            "name": "Xã Ngọc Long",
            "code": 859,
            "codename": "xa_ngoc_long",
            "division_type": "xã",
            "short_codename": "ngoc_long"
          },
          {
            "name": "Xã Đường Thượng",
            "code": 862,
            "codename": "xa_duong_thuong",
            "division_type": "xã",
            "short_codename": "duong_thuong"
          },
          {
            "name": "Xã Lũng Hồ",
            "code": 865,
            "codename": "xa_lung_ho",
            "division_type": "xã",
            "short_codename": "lung_ho"
          },
          {
            "name": "Xã Du Tiến",
            "code": 868,
            "codename": "xa_du_tien",
            "division_type": "xã",
            "short_codename": "du_tien"
          },
          {
            "name": "Xã Du Già",
            "code": 871,
            "codename": "xa_du_gia",
            "division_type": "xã",
            "short_codename": "du_gia"
          }
        ]
      },
      {
        "name": "Huyện Quản Bạ",
        "code": 29,
        "codename": "huyen_quan_ba",
        "division_type": "huyện",
        "short_codename": "quan_ba",
        "wards": [
          {
            "name": "Thị trấn Tam Sơn",
            "code": 874,
            "codename": "thi_tran_tam_son",
            "division_type": "xã",
            "short_codename": "tam_son"
          },
          {
            "name": "Xã Bát Đại Sơn",
            "code": 877,
            "codename": "xa_bat_dai_son",
            "division_type": "xã",
            "short_codename": "bat_dai_son"
          },
          {
            "name": "Xã Nghĩa Thuận",
            "code": 880,
            "codename": "xa_nghia_thuan",
            "division_type": "xã",
            "short_codename": "nghia_thuan"
          },
          {
            "name": "Xã Cán Tỷ",
            "code": 883,
            "codename": "xa_can_ty",
            "division_type": "xã",
            "short_codename": "can_ty"
          },
          {
            "name": "Xã Cao Mã Pờ",
            "code": 886,
            "codename": "xa_cao_ma_po",
            "division_type": "xã",
            "short_codename": "cao_ma_po"
          },
          {
            "name": "Xã Thanh Vân",
            "code": 889,
            "codename": "xa_thanh_van",
            "division_type": "xã",
            "short_codename": "thanh_van"
          },
          {
            "name": "Xã Tùng Vài",
            "code": 892,
            "codename": "xa_tung_vai",
            "division_type": "xã",
            "short_codename": "tung_vai"
          },
          {
            "name": "Xã Đông Hà",
            "code": 895,
            "codename": "xa_dong_ha",
            "division_type": "xã",
            "short_codename": "dong_ha"
          },
          {
            "name": "Xã Quản Bạ",
            "code": 898,
            "codename": "xa_quan_ba",
            "division_type": "xã",
            "short_codename": "quan_ba"
          },
          {
            "name": "Xã Lùng Tám",
            "code": 901,
            "codename": "xa_lung_tam",
            "division_type": "xã",
            "short_codename": "lung_tam"
          },
          {
            "name": "Xã Quyết Tiến",
            "code": 904,
            "codename": "xa_quyet_tien",
            "division_type": "xã",
            "short_codename": "quyet_tien"
          },
          {
            "name": "Xã Tả Ván",
            "code": 907,
            "codename": "xa_ta_van",
            "division_type": "xã",
            "short_codename": "ta_van"
          },
          {
            "name": "Xã Thái An",
            "code": 910,
            "codename": "xa_thai_an",
            "division_type": "xã",
            "short_codename": "thai_an"
          }
        ]
      },
      {
        "name": "Huyện Vị Xuyên",
        "code": 30,
        "codename": "huyen_vi_xuyen",
        "division_type": "huyện",
        "short_codename": "vi_xuyen",
        "wards": [
          {
            "name": "Xã Kim Thạch",
            "code": 703,
            "codename": "xa_kim_thach",
            "division_type": "xã",
            "short_codename": "kim_thach"
          },
          {
            "name": "Xã Phú Linh",
            "code": 706,
            "codename": "xa_phu_linh",
            "division_type": "xã",
            "short_codename": "phu_linh"
          },
          {
            "name": "Xã Kim Linh",
            "code": 709,
            "codename": "xa_kim_linh",
            "division_type": "xã",
            "short_codename": "kim_linh"
          },
          {
            "name": "Thị trấn Vị Xuyên",
            "code": 913,
            "codename": "thi_tran_vi_xuyen",
            "division_type": "xã",
            "short_codename": "vi_xuyen"
          },
          {
            "name": "Thị trấn Nông Trường Việt Lâm",
            "code": 916,
            "codename": "thi_tran_nong_truong_viet_lam",
            "division_type": "xã",
            "short_codename": "nong_truong_viet_lam"
          },
          {
            "name": "Xã Minh Tân",
            "code": 919,
            "codename": "xa_minh_tan",
            "division_type": "xã",
            "short_codename": "minh_tan"
          },
          {
            "name": "Xã Thuận Hoà",
            "code": 922,
            "codename": "xa_thuan_hoa",
            "division_type": "xã",
            "short_codename": "thuan_hoa"
          },
          {
            "name": "Xã Tùng Bá",
            "code": 925,
            "codename": "xa_tung_ba",
            "division_type": "xã",
            "short_codename": "tung_ba"
          },
          {
            "name": "Xã Thanh Thủy",
            "code": 928,
            "codename": "xa_thanh_thuy",
            "division_type": "xã",
            "short_codename": "thanh_thuy"
          },
          {
            "name": "Xã Thanh Đức",
            "code": 931,
            "codename": "xa_thanh_duc",
            "division_type": "xã",
            "short_codename": "thanh_duc"
          },
          {
            "name": "Xã Phong Quang",
            "code": 934,
            "codename": "xa_phong_quang",
            "division_type": "xã",
            "short_codename": "phong_quang"
          },
          {
            "name": "Xã Xín Chải",
            "code": 937,
            "codename": "xa_xin_chai",
            "division_type": "xã",
            "short_codename": "xin_chai"
          },
          {
            "name": "Xã Phương Tiến",
            "code": 940,
            "codename": "xa_phuong_tien",
            "division_type": "xã",
            "short_codename": "phuong_tien"
          },
          {
            "name": "Xã Lao Chải",
            "code": 943,
            "codename": "xa_lao_chai",
            "division_type": "xã",
            "short_codename": "lao_chai"
          },
          {
            "name": "Xã Cao Bồ",
            "code": 952,
            "codename": "xa_cao_bo",
            "division_type": "xã",
            "short_codename": "cao_bo"
          },
          {
            "name": "Xã Đạo Đức",
            "code": 955,
            "codename": "xa_dao_duc",
            "division_type": "xã",
            "short_codename": "dao_duc"
          },
          {
            "name": "Xã Thượng Sơn",
            "code": 958,
            "codename": "xa_thuong_son",
            "division_type": "xã",
            "short_codename": "thuong_son"
          },
          {
            "name": "Xã Linh Hồ",
            "code": 961,
            "codename": "xa_linh_ho",
            "division_type": "xã",
            "short_codename": "linh_ho"
          },
          {
            "name": "Xã Quảng Ngần",
            "code": 964,
            "codename": "xa_quang_ngan",
            "division_type": "xã",
            "short_codename": "quang_ngan"
          },
          {
            "name": "Xã Việt Lâm",
            "code": 967,
            "codename": "xa_viet_lam",
            "division_type": "xã",
            "short_codename": "viet_lam"
          },
          {
            "name": "Xã Ngọc Linh",
            "code": 970,
            "codename": "xa_ngoc_linh",
            "division_type": "xã",
            "short_codename": "ngoc_linh"
          },
          {
            "name": "Xã Ngọc Minh",
            "code": 973,
            "codename": "xa_ngoc_minh",
            "division_type": "xã",
            "short_codename": "ngoc_minh"
          },
          {
            "name": "Xã Bạch Ngọc",
            "code": 976,
            "codename": "xa_bach_ngoc",
            "division_type": "xã",
            "short_codename": "bach_ngoc"
          },
          {
            "name": "Xã Trung Thành",
            "code": 979,
            "codename": "xa_trung_thanh",
            "division_type": "xã",
            "short_codename": "trung_thanh"
          }
        ]
      },
      {
        "name": "Huyện Bắc Mê",
        "code": 31,
        "codename": "huyen_bac_me",
        "division_type": "huyện",
        "short_codename": "bac_me",
        "wards": [
          {
            "name": "Xã Minh Sơn",
            "code": 982,
            "codename": "xa_minh_son",
            "division_type": "xã",
            "short_codename": "minh_son"
          },
          {
            "name": "Xã Giáp Trung",
            "code": 985,
            "codename": "xa_giap_trung",
            "division_type": "xã",
            "short_codename": "giap_trung"
          },
          {
            "name": "Xã Yên Định",
            "code": 988,
            "codename": "xa_yen_dinh",
            "division_type": "xã",
            "short_codename": "yen_dinh"
          },
          {
            "name": "Thị trấn Yên Phú",
            "code": 991,
            "codename": "thi_tran_yen_phu",
            "division_type": "xã",
            "short_codename": "yen_phu"
          },
          {
            "name": "Xã Minh Ngọc",
            "code": 994,
            "codename": "xa_minh_ngoc",
            "division_type": "xã",
            "short_codename": "minh_ngoc"
          },
          {
            "name": "Xã Yên Phong",
            "code": 997,
            "codename": "xa_yen_phong",
            "division_type": "xã",
            "short_codename": "yen_phong"
          },
          {
            "name": "Xã Lạc Nông",
            "code": 1000,
            "codename": "xa_lac_nong",
            "division_type": "xã",
            "short_codename": "lac_nong"
          },
          {
            "name": "Xã Phú Nam",
            "code": 1003,
            "codename": "xa_phu_nam",
            "division_type": "xã",
            "short_codename": "phu_nam"
          },
          {
            "name": "Xã Yên Cường",
            "code": 1006,
            "codename": "xa_yen_cuong",
            "division_type": "xã",
            "short_codename": "yen_cuong"
          },
          {
            "name": "Xã Thượng Tân",
            "code": 1009,
            "codename": "xa_thuong_tan",
            "division_type": "xã",
            "short_codename": "thuong_tan"
          },
          {
            "name": "Xã Đường Âm",
            "code": 1012,
            "codename": "xa_duong_am",
            "division_type": "xã",
            "short_codename": "duong_am"
          },
          {
            "name": "Xã Đường Hồng",
            "code": 1015,
            "codename": "xa_duong_hong",
            "division_type": "xã",
            "short_codename": "duong_hong"
          },
          {
            "name": "Xã Phiêng Luông",
            "code": 1018,
            "codename": "xa_phieng_luong",
            "division_type": "xã",
            "short_codename": "phieng_luong"
          }
        ]
      },
      {
        "name": "Huyện Hoàng Su Phì",
        "code": 32,
        "codename": "huyen_hoang_su_phi",
        "division_type": "huyện",
        "short_codename": "hoang_su_phi",
        "wards": [
          {
            "name": "Thị trấn Vinh Quang",
            "code": 1021,
            "codename": "thi_tran_vinh_quang",
            "division_type": "xã",
            "short_codename": "vinh_quang"
          },
          {
            "name": "Xã Bản Máy",
            "code": 1024,
            "codename": "xa_ban_may",
            "division_type": "xã",
            "short_codename": "ban_may"
          },
          {
            "name": "Xã Thàng Tín",
            "code": 1027,
            "codename": "xa_thang_tin",
            "division_type": "xã",
            "short_codename": "thang_tin"
          },
          {
            "name": "Xã Thèn Chu Phìn",
            "code": 1030,
            "codename": "xa_then_chu_phin",
            "division_type": "xã",
            "short_codename": "then_chu_phin"
          },
          {
            "name": "Xã Pố Lồ",
            "code": 1033,
            "codename": "xa_po_lo",
            "division_type": "xã",
            "short_codename": "po_lo"
          },
          {
            "name": "Xã Bản Phùng",
            "code": 1036,
            "codename": "xa_ban_phung",
            "division_type": "xã",
            "short_codename": "ban_phung"
          },
          {
            "name": "Xã Túng Sán",
            "code": 1039,
            "codename": "xa_tung_san",
            "division_type": "xã",
            "short_codename": "tung_san"
          },
          {
            "name": "Xã Chiến Phố",
            "code": 1042,
            "codename": "xa_chien_pho",
            "division_type": "xã",
            "short_codename": "chien_pho"
          },
          {
            "name": "Xã Đản Ván",
            "code": 1045,
            "codename": "xa_dan_van",
            "division_type": "xã",
            "short_codename": "dan_van"
          },
          {
            "name": "Xã Tụ Nhân",
            "code": 1048,
            "codename": "xa_tu_nhan",
            "division_type": "xã",
            "short_codename": "tu_nhan"
          },
          {
            "name": "Xã Tân Tiến",
            "code": 1051,
            "codename": "xa_tan_tien",
            "division_type": "xã",
            "short_codename": "tan_tien"
          },
          {
            "name": "Xã Nàng Đôn",
            "code": 1054,
            "codename": "xa_nang_don",
            "division_type": "xã",
            "short_codename": "nang_don"
          },
          {
            "name": "Xã Pờ Ly Ngài",
            "code": 1057,
            "codename": "xa_po_ly_ngai",
            "division_type": "xã",
            "short_codename": "po_ly_ngai"
          },
          {
            "name": "Xã Sán Xả Hồ",
            "code": 1060,
            "codename": "xa_san_xa_ho",
            "division_type": "xã",
            "short_codename": "san_xa_ho"
          },
          {
            "name": "Xã Bản Luốc",
            "code": 1063,
            "codename": "xa_ban_luoc",
            "division_type": "xã",
            "short_codename": "ban_luoc"
          },
          {
            "name": "Xã Ngàm Đăng Vài",
            "code": 1066,
            "codename": "xa_ngam_dang_vai",
            "division_type": "xã",
            "short_codename": "ngam_dang_vai"
          },
          {
            "name": "Xã Bản Nhùng",
            "code": 1069,
            "codename": "xa_ban_nhung",
            "division_type": "xã",
            "short_codename": "ban_nhung"
          },
          {
            "name": "Xã Tả Sử Choóng",
            "code": 1072,
            "codename": "xa_ta_su_choong",
            "division_type": "xã",
            "short_codename": "ta_su_choong"
          },
          {
            "name": "Xã Nậm Dịch",
            "code": 1075,
            "codename": "xa_nam_dich",
            "division_type": "xã",
            "short_codename": "nam_dich"
          },
          {
            "name": "Xã Hồ Thầu",
            "code": 1081,
            "codename": "xa_ho_thau",
            "division_type": "xã",
            "short_codename": "ho_thau"
          },
          {
            "name": "Xã Nam Sơn",
            "code": 1084,
            "codename": "xa_nam_son",
            "division_type": "xã",
            "short_codename": "nam_son"
          },
          {
            "name": "Xã Nậm Tỵ",
            "code": 1087,
            "codename": "xa_nam_ty",
            "division_type": "xã",
            "short_codename": "nam_ty"
          },
          {
            "name": "Xã Thông Nguyên",
            "code": 1090,
            "codename": "xa_thong_nguyen",
            "division_type": "xã",
            "short_codename": "thong_nguyen"
          },
          {
            "name": "Xã Nậm Khòa",
            "code": 1093,
            "codename": "xa_nam_khoa",
            "division_type": "xã",
            "short_codename": "nam_khoa"
          }
        ]
      },
      {
        "name": "Huyện Xín Mần",
        "code": 33,
        "codename": "huyen_xin_man",
        "division_type": "huyện",
        "short_codename": "xin_man",
        "wards": [
          {
            "name": "Thị trấn Cốc Pài",
            "code": 1096,
            "codename": "thi_tran_coc_pai",
            "division_type": "xã",
            "short_codename": "coc_pai"
          },
          {
            "name": "Xã Nàn Xỉn",
            "code": 1099,
            "codename": "xa_nan_xin",
            "division_type": "xã",
            "short_codename": "nan_xin"
          },
          {
            "name": "Xã Bản Díu",
            "code": 1102,
            "codename": "xa_ban_diu",
            "division_type": "xã",
            "short_codename": "ban_diu"
          },
          {
            "name": "Xã Chí Cà",
            "code": 1105,
            "codename": "xa_chi_ca",
            "division_type": "xã",
            "short_codename": "chi_ca"
          },
          {
            "name": "Xã Xín Mần",
            "code": 1108,
            "codename": "xa_xin_man",
            "division_type": "xã",
            "short_codename": "xin_man"
          },
          {
            "name": "Xã Thèn Phàng",
            "code": 1114,
            "codename": "xa_then_phang",
            "division_type": "xã",
            "short_codename": "then_phang"
          },
          {
            "name": "Xã Trung Thịnh",
            "code": 1117,
            "codename": "xa_trung_thinh",
            "division_type": "xã",
            "short_codename": "trung_thinh"
          },
          {
            "name": "Xã Pà Vầy Sủ",
            "code": 1120,
            "codename": "xa_pa_vay_su",
            "division_type": "xã",
            "short_codename": "pa_vay_su"
          },
          {
            "name": "Xã Cốc Rế",
            "code": 1123,
            "codename": "xa_coc_re",
            "division_type": "xã",
            "short_codename": "coc_re"
          },
          {
            "name": "Xã Thu Tà",
            "code": 1126,
            "codename": "xa_thu_ta",
            "division_type": "xã",
            "short_codename": "thu_ta"
          },
          {
            "name": "Xã Nàn Ma",
            "code": 1129,
            "codename": "xa_nan_ma",
            "division_type": "xã",
            "short_codename": "nan_ma"
          },
          {
            "name": "Xã Tả Nhìu",
            "code": 1132,
            "codename": "xa_ta_nhiu",
            "division_type": "xã",
            "short_codename": "ta_nhiu"
          },
          {
            "name": "Xã Bản Ngò",
            "code": 1135,
            "codename": "xa_ban_ngo",
            "division_type": "xã",
            "short_codename": "ban_ngo"
          },
          {
            "name": "Xã Chế Là",
            "code": 1138,
            "codename": "xa_che_la",
            "division_type": "xã",
            "short_codename": "che_la"
          },
          {
            "name": "Xã Nấm Dẩn",
            "code": 1141,
            "codename": "xa_nam_dan",
            "division_type": "xã",
            "short_codename": "nam_dan"
          },
          {
            "name": "Xã Quảng Nguyên",
            "code": 1144,
            "codename": "xa_quang_nguyen",
            "division_type": "xã",
            "short_codename": "quang_nguyen"
          },
          {
            "name": "Xã Nà Chì",
            "code": 1147,
            "codename": "xa_na_chi",
            "division_type": "xã",
            "short_codename": "na_chi"
          },
          {
            "name": "Xã Khuôn Lùng",
            "code": 1150,
            "codename": "xa_khuon_lung",
            "division_type": "xã",
            "short_codename": "khuon_lung"
          }
        ]
      },
      {
        "name": "Huyện Bắc Quang",
        "code": 34,
        "codename": "huyen_bac_quang",
        "division_type": "huyện",
        "short_codename": "bac_quang",
        "wards": [
          {
            "name": "Thị trấn Việt Quang",
            "code": 1153,
            "codename": "thi_tran_viet_quang",
            "division_type": "xã",
            "short_codename": "viet_quang"
          },
          {
            "name": "Thị trấn Vĩnh Tuy",
            "code": 1156,
            "codename": "thi_tran_vinh_tuy",
            "division_type": "xã",
            "short_codename": "vinh_tuy"
          },
          {
            "name": "Xã Tân Lập",
            "code": 1159,
            "codename": "xa_tan_lap",
            "division_type": "xã",
            "short_codename": "tan_lap"
          },
          {
            "name": "Xã Tân Thành",
            "code": 1162,
            "codename": "xa_tan_thanh",
            "division_type": "xã",
            "short_codename": "tan_thanh"
          },
          {
            "name": "Xã Đồng Tiến",
            "code": 1165,
            "codename": "xa_dong_tien",
            "division_type": "xã",
            "short_codename": "dong_tien"
          },
          {
            "name": "Xã Đồng Tâm",
            "code": 1168,
            "codename": "xa_dong_tam",
            "division_type": "xã",
            "short_codename": "dong_tam"
          },
          {
            "name": "Xã Tân Quang",
            "code": 1171,
            "codename": "xa_tan_quang",
            "division_type": "xã",
            "short_codename": "tan_quang"
          },
          {
            "name": "Xã Thượng Bình",
            "code": 1174,
            "codename": "xa_thuong_binh",
            "division_type": "xã",
            "short_codename": "thuong_binh"
          },
          {
            "name": "Xã Hữu Sản",
            "code": 1177,
            "codename": "xa_huu_san",
            "division_type": "xã",
            "short_codename": "huu_san"
          },
          {
            "name": "Xã Kim Ngọc",
            "code": 1180,
            "codename": "xa_kim_ngoc",
            "division_type": "xã",
            "short_codename": "kim_ngoc"
          },
          {
            "name": "Xã Việt Vinh",
            "code": 1183,
            "codename": "xa_viet_vinh",
            "division_type": "xã",
            "short_codename": "viet_vinh"
          },
          {
            "name": "Xã Bằng Hành",
            "code": 1186,
            "codename": "xa_bang_hanh",
            "division_type": "xã",
            "short_codename": "bang_hanh"
          },
          {
            "name": "Xã Quang Minh",
            "code": 1189,
            "codename": "xa_quang_minh",
            "division_type": "xã",
            "short_codename": "quang_minh"
          },
          {
            "name": "Xã Liên Hiệp",
            "code": 1192,
            "codename": "xa_lien_hiep",
            "division_type": "xã",
            "short_codename": "lien_hiep"
          },
          {
            "name": "Xã Vô Điếm",
            "code": 1195,
            "codename": "xa_vo_diem",
            "division_type": "xã",
            "short_codename": "vo_diem"
          },
          {
            "name": "Xã Việt Hồng",
            "code": 1198,
            "codename": "xa_viet_hong",
            "division_type": "xã",
            "short_codename": "viet_hong"
          },
          {
            "name": "Xã Hùng An",
            "code": 1201,
            "codename": "xa_hung_an",
            "division_type": "xã",
            "short_codename": "hung_an"
          },
          {
            "name": "Xã Đức Xuân",
            "code": 1204,
            "codename": "xa_duc_xuan",
            "division_type": "xã",
            "short_codename": "duc_xuan"
          },
          {
            "name": "Xã Tiên Kiều",
            "code": 1207,
            "codename": "xa_tien_kieu",
            "division_type": "xã",
            "short_codename": "tien_kieu"
          },
          {
            "name": "Xã Vĩnh Hảo",
            "code": 1210,
            "codename": "xa_vinh_hao",
            "division_type": "xã",
            "short_codename": "vinh_hao"
          },
          {
            "name": "Xã Vĩnh Phúc",
            "code": 1213,
            "codename": "xa_vinh_phuc",
            "division_type": "xã",
            "short_codename": "vinh_phuc"
          },
          {
            "name": "Xã Đồng Yên",
            "code": 1216,
            "codename": "xa_dong_yen",
            "division_type": "xã",
            "short_codename": "dong_yen"
          },
          {
            "name": "Xã Đông Thành",
            "code": 1219,
            "codename": "xa_dong_thanh",
            "division_type": "xã",
            "short_codename": "dong_thanh"
          }
        ]
      },
      {
        "name": "Huyện Quang Bình",
        "code": 35,
        "codename": "huyen_quang_binh",
        "division_type": "huyện",
        "short_codename": "quang_binh",
        "wards": [
          {
            "name": "Xã Xuân Minh",
            "code": 1222,
            "codename": "xa_xuan_minh",
            "division_type": "xã",
            "short_codename": "xuan_minh"
          },
          {
            "name": "Xã Tiên Nguyên",
            "code": 1225,
            "codename": "xa_tien_nguyen",
            "division_type": "xã",
            "short_codename": "tien_nguyen"
          },
          {
            "name": "Xã Tân Nam",
            "code": 1228,
            "codename": "xa_tan_nam",
            "division_type": "xã",
            "short_codename": "tan_nam"
          },
          {
            "name": "Xã Bản Rịa",
            "code": 1231,
            "codename": "xa_ban_ria",
            "division_type": "xã",
            "short_codename": "ban_ria"
          },
          {
            "name": "Xã Yên Thành",
            "code": 1234,
            "codename": "xa_yen_thanh",
            "division_type": "xã",
            "short_codename": "yen_thanh"
          },
          {
            "name": "Thị trấn Yên Bình",
            "code": 1237,
            "codename": "thi_tran_yen_binh",
            "division_type": "xã",
            "short_codename": "yen_binh"
          },
          {
            "name": "Xã Tân Trịnh",
            "code": 1240,
            "codename": "xa_tan_trinh",
            "division_type": "xã",
            "short_codename": "tan_trinh"
          },
          {
            "name": "Xã Tân Bắc",
            "code": 1243,
            "codename": "xa_tan_bac",
            "division_type": "xã",
            "short_codename": "tan_bac"
          },
          {
            "name": "Xã Bằng Lang",
            "code": 1246,
            "codename": "xa_bang_lang",
            "division_type": "xã",
            "short_codename": "bang_lang"
          },
          {
            "name": "Xã Yên Hà",
            "code": 1249,
            "codename": "xa_yen_ha",
            "division_type": "xã",
            "short_codename": "yen_ha"
          },
          {
            "name": "Xã Hương Sơn",
            "code": 1252,
            "codename": "xa_huong_son",
            "division_type": "xã",
            "short_codename": "huong_son"
          },
          {
            "name": "Xã Xuân Giang",
            "code": 1255,
            "codename": "xa_xuan_giang",
            "division_type": "xã",
            "short_codename": "xuan_giang"
          },
          {
            "name": "Xã Nà Khương",
            "code": 1258,
            "codename": "xa_na_khuong",
            "division_type": "xã",
            "short_codename": "na_khuong"
          },
          {
            "name": "Xã Tiên Yên",
            "code": 1261,
            "codename": "xa_tien_yen",
            "division_type": "xã",
            "short_codename": "tien_yen"
          },
          {
            "name": "Xã Vĩ Thượng",
            "code": 1264,
            "codename": "xa_vi_thuong",
            "division_type": "xã",
            "short_codename": "vi_thuong"
          }
        ]
      }
    ]
  },
  {
    "name": "Tỉnh Cao Bằng",
    "code": 4,
    "codename": "tinh_cao_bang",
    "division_type": "tỉnh",
    "phone_code": 206,
    "districts": [
      {
        "name": "Thành phố Cao Bằng",
        "code": 40,
        "codename": "thanh_pho_cao_bang",
        "division_type": "huyện",
        "short_codename": "cao_bang",
        "wards": [
          {
            "name": "Phường Sông Hiến",
            "code": 1267,
            "codename": "phuong_song_hien",
            "division_type": "xã",
            "short_codename": "song_hien"
          },
          {
            "name": "Phường Sông Bằng",
            "code": 1270,
            "codename": "phuong_song_bang",
            "division_type": "xã",
            "short_codename": "song_bang"
          },
          {
            "name": "Phường Hợp Giang",
            "code": 1273,
            "codename": "phuong_hop_giang",
            "division_type": "xã",
            "short_codename": "hop_giang"
          },
          {
            "name": "Phường Tân Giang",
            "code": 1276,
            "codename": "phuong_tan_giang",
            "division_type": "xã",
            "short_codename": "tan_giang"
          },
          {
            "name": "Phường Ngọc Xuân",
            "code": 1279,
            "codename": "phuong_ngoc_xuan",
            "division_type": "xã",
            "short_codename": "ngoc_xuan"
          },
          {
            "name": "Phường Đề Thám",
            "code": 1282,
            "codename": "phuong_de_tham",
            "division_type": "xã",
            "short_codename": "de_tham"
          },
          {
            "name": "Phường Hoà Chung",
            "code": 1285,
            "codename": "phuong_hoa_chung",
            "division_type": "xã",
            "short_codename": "hoa_chung"
          },
          {
            "name": "Phường Duyệt Trung",
            "code": 1288,
            "codename": "phuong_duyet_trung",
            "division_type": "xã",
            "short_codename": "duyet_trung"
          },
          {
            "name": "Xã Vĩnh Quang",
            "code": 1693,
            "codename": "xa_vinh_quang",
            "division_type": "xã",
            "short_codename": "vinh_quang"
          },
          {
            "name": "Xã Hưng Đạo",
            "code": 1705,
            "codename": "xa_hung_dao",
            "division_type": "xã",
            "short_codename": "hung_dao"
          },
          {
            "name": "Xã Chu Trinh",
            "code": 1720,
            "codename": "xa_chu_trinh",
            "division_type": "xã",
            "short_codename": "chu_trinh"
          }
        ]
      },
      {
        "name": "Huyện Bảo Lâm",
        "code": 42,
        "codename": "huyen_bao_lam",
        "division_type": "huyện",
        "short_codename": "bao_lam",
        "wards": [
          {
            "name": "Thị trấn Pác Miầu",
            "code": 1290,
            "codename": "thi_tran_pac_miau",
            "division_type": "xã",
            "short_codename": "pac_miau"
          },
          {
            "name": "Xã Đức Hạnh",
            "code": 1291,
            "codename": "xa_duc_hanh",
            "division_type": "xã",
            "short_codename": "duc_hanh"
          },
          {
            "name": "Xã Lý Bôn",
            "code": 1294,
            "codename": "xa_ly_bon",
            "division_type": "xã",
            "short_codename": "ly_bon"
          },
          {
            "name": "Xã Nam Cao",
            "code": 1296,
            "codename": "xa_nam_cao",
            "division_type": "xã",
            "short_codename": "nam_cao"
          },
          {
            "name": "Xã Nam Quang",
            "code": 1297,
            "codename": "xa_nam_quang",
            "division_type": "xã",
            "short_codename": "nam_quang"
          },
          {
            "name": "Xã Vĩnh Quang",
            "code": 1300,
            "codename": "xa_vinh_quang",
            "division_type": "xã",
            "short_codename": "vinh_quang"
          },
          {
            "name": "Xã Quảng Lâm",
            "code": 1303,
            "codename": "xa_quang_lam",
            "division_type": "xã",
            "short_codename": "quang_lam"
          },
          {
            "name": "Xã Thạch Lâm",
            "code": 1304,
            "codename": "xa_thach_lam",
            "division_type": "xã",
            "short_codename": "thach_lam"
          },
          {
            "name": "Xã Vĩnh Phong",
            "code": 1309,
            "codename": "xa_vinh_phong",
            "division_type": "xã",
            "short_codename": "vinh_phong"
          },
          {
            "name": "Xã Mông Ân",
            "code": 1312,
            "codename": "xa_mong_an",
            "division_type": "xã",
            "short_codename": "mong_an"
          },
          {
            "name": "Xã Thái Học",
            "code": 1315,
            "codename": "xa_thai_hoc",
            "division_type": "xã",
            "short_codename": "thai_hoc"
          },
          {
            "name": "Xã Thái Sơn",
            "code": 1316,
            "codename": "xa_thai_son",
            "division_type": "xã",
            "short_codename": "thai_son"
          },
          {
            "name": "Xã Yên Thổ",
            "code": 1318,
            "codename": "xa_yen_tho",
            "division_type": "xã",
            "short_codename": "yen_tho"
          }
        ]
      },
      {
        "name": "Huyện Bảo Lạc",
        "code": 43,
        "codename": "huyen_bao_lac",
        "division_type": "huyện",
        "short_codename": "bao_lac",
        "wards": [
          {
            "name": "Thị trấn Bảo Lạc",
            "code": 1321,
            "codename": "thi_tran_bao_lac",
            "division_type": "xã",
            "short_codename": "bao_lac"
          },
          {
            "name": "Xã Cốc Pàng",
            "code": 1324,
            "codename": "xa_coc_pang",
            "division_type": "xã",
            "short_codename": "coc_pang"
          },
          {
            "name": "Xã Thượng Hà",
            "code": 1327,
            "codename": "xa_thuong_ha",
            "division_type": "xã",
            "short_codename": "thuong_ha"
          },
          {
            "name": "Xã Cô Ba",
            "code": 1330,
            "codename": "xa_co_ba",
            "division_type": "xã",
            "short_codename": "co_ba"
          },
          {
            "name": "Xã Bảo Toàn",
            "code": 1333,
            "codename": "xa_bao_toan",
            "division_type": "xã",
            "short_codename": "bao_toan"
          },
          {
            "name": "Xã Khánh Xuân",
            "code": 1336,
            "codename": "xa_khanh_xuan",
            "division_type": "xã",
            "short_codename": "khanh_xuan"
          },
          {
            "name": "Xã Xuân Trường",
            "code": 1339,
            "codename": "xa_xuan_truong",
            "division_type": "xã",
            "short_codename": "xuan_truong"
          },
          {
            "name": "Xã Hồng Trị",
            "code": 1342,
            "codename": "xa_hong_tri",
            "division_type": "xã",
            "short_codename": "hong_tri"
          },
          {
            "name": "Xã Kim Cúc",
            "code": 1343,
            "codename": "xa_kim_cuc",
            "division_type": "xã",
            "short_codename": "kim_cuc"
          },
          {
            "name": "Xã Phan Thanh",
            "code": 1345,
            "codename": "xa_phan_thanh",
            "division_type": "xã",
            "short_codename": "phan_thanh"
          },
          {
            "name": "Xã Hồng An",
            "code": 1348,
            "codename": "xa_hong_an",
            "division_type": "xã",
            "short_codename": "hong_an"
          },
          {
            "name": "Xã Hưng Đạo",
            "code": 1351,
            "codename": "xa_hung_dao",
            "division_type": "xã",
            "short_codename": "hung_dao"
          },
          {
            "name": "Xã Hưng Thịnh",
            "code": 1352,
            "codename": "xa_hung_thinh",
            "division_type": "xã",
            "short_codename": "hung_thinh"
          },
          {
            "name": "Xã Huy Giáp",
            "code": 1354,
            "codename": "xa_huy_giap",
            "division_type": "xã",
            "short_codename": "huy_giap"
          },
          {
            "name": "Xã Đình Phùng",
            "code": 1357,
            "codename": "xa_dinh_phung",
            "division_type": "xã",
            "short_codename": "dinh_phung"
          },
          {
            "name": "Xã Sơn Lập",
            "code": 1359,
            "codename": "xa_son_lap",
            "division_type": "xã",
            "short_codename": "son_lap"
          },
          {
            "name": "Xã Sơn Lộ",
            "code": 1360,
            "codename": "xa_son_lo",
            "division_type": "xã",
            "short_codename": "son_lo"
          }
        ]
      },
      {
        "name": "Huyện Hà Quảng",
        "code": 45,
        "codename": "huyen_ha_quang",
        "division_type": "huyện",
        "short_codename": "ha_quang",
        "wards": [
          {
            "name": "Thị trấn Thông Nông",
            "code": 1363,
            "codename": "thi_tran_thong_nong",
            "division_type": "xã",
            "short_codename": "thong_nong"
          },
          {
            "name": "Xã Cần Yên",
            "code": 1366,
            "codename": "xa_can_yen",
            "division_type": "xã",
            "short_codename": "can_yen"
          },
          {
            "name": "Xã Cần Nông",
            "code": 1367,
            "codename": "xa_can_nong",
            "division_type": "xã",
            "short_codename": "can_nong"
          },
          {
            "name": "Xã Lương Thông",
            "code": 1372,
            "codename": "xa_luong_thong",
            "division_type": "xã",
            "short_codename": "luong_thong"
          },
          {
            "name": "Xã Đa Thông",
            "code": 1375,
            "codename": "xa_da_thong",
            "division_type": "xã",
            "short_codename": "da_thong"
          },
          {
            "name": "Xã Ngọc Động",
            "code": 1378,
            "codename": "xa_ngoc_dong",
            "division_type": "xã",
            "short_codename": "ngoc_dong"
          },
          {
            "name": "Xã Yên Sơn",
            "code": 1381,
            "codename": "xa_yen_son",
            "division_type": "xã",
            "short_codename": "yen_son"
          },
          {
            "name": "Xã Lương Can",
            "code": 1384,
            "codename": "xa_luong_can",
            "division_type": "xã",
            "short_codename": "luong_can"
          },
          {
            "name": "Xã Thanh Long",
            "code": 1387,
            "codename": "xa_thanh_long",
            "division_type": "xã",
            "short_codename": "thanh_long"
          },
          {
            "name": "Thị trấn Xuân Hòa",
            "code": 1392,
            "codename": "thi_tran_xuan_hoa",
            "division_type": "xã",
            "short_codename": "xuan_hoa"
          },
          {
            "name": "Xã Lũng Nặm",
            "code": 1393,
            "codename": "xa_lung_nam",
            "division_type": "xã",
            "short_codename": "lung_nam"
          },
          {
            "name": "Xã Trường Hà",
            "code": 1399,
            "codename": "xa_truong_ha",
            "division_type": "xã",
            "short_codename": "truong_ha"
          },
          {
            "name": "Xã Cải Viên",
            "code": 1402,
            "codename": "xa_cai_vien",
            "division_type": "xã",
            "short_codename": "cai_vien"
          },
          {
            "name": "Xã Nội Thôn",
            "code": 1411,
            "codename": "xa_noi_thon",
            "division_type": "xã",
            "short_codename": "noi_thon"
          },
          {
            "name": "Xã Tổng Cọt",
            "code": 1414,
            "codename": "xa_tong_cot",
            "division_type": "xã",
            "short_codename": "tong_cot"
          },
          {
            "name": "Xã Sóc Hà",
            "code": 1417,
            "codename": "xa_soc_ha",
            "division_type": "xã",
            "short_codename": "soc_ha"
          },
          {
            "name": "Xã Thượng Thôn",
            "code": 1420,
            "codename": "xa_thuong_thon",
            "division_type": "xã",
            "short_codename": "thuong_thon"
          },
          {
            "name": "Xã Hồng Sỹ",
            "code": 1429,
            "codename": "xa_hong_sy",
            "division_type": "xã",
            "short_codename": "hong_sy"
          },
          {
            "name": "Xã Quý Quân",
            "code": 1432,
            "codename": "xa_quy_quan",
            "division_type": "xã",
            "short_codename": "quy_quan"
          },
          {
            "name": "Xã Mã Ba",
            "code": 1435,
            "codename": "xa_ma_ba",
            "division_type": "xã",
            "short_codename": "ma_ba"
          },
          {
            "name": "Xã Ngọc Đào",
            "code": 1438,
            "codename": "xa_ngoc_dao",
            "division_type": "xã",
            "short_codename": "ngoc_dao"
          }
        ]
      },
      {
        "name": "Huyện Trùng Khánh",
        "code": 47,
        "codename": "huyen_trung_khanh",
        "division_type": "huyện",
        "short_codename": "trung_khanh",
        "wards": [
          {
            "name": "Thị trấn Trà Lĩnh",
            "code": 1447,
            "codename": "thi_tran_tra_linh",
            "division_type": "xã",
            "short_codename": "tra_linh"
          },
          {
            "name": "Xã Tri Phương",
            "code": 1453,
            "codename": "xa_tri_phuong",
            "division_type": "xã",
            "short_codename": "tri_phuong"
          },
          {
            "name": "Xã Quang Hán",
            "code": 1456,
            "codename": "xa_quang_han",
            "division_type": "xã",
            "short_codename": "quang_han"
          },
          {
            "name": "Xã Xuân Nội",
            "code": 1462,
            "codename": "xa_xuan_noi",
            "division_type": "xã",
            "short_codename": "xuan_noi"
          },
          {
            "name": "Xã Quang Trung",
            "code": 1465,
            "codename": "xa_quang_trung",
            "division_type": "xã",
            "short_codename": "quang_trung"
          },
          {
            "name": "Xã Quang Vinh",
            "code": 1468,
            "codename": "xa_quang_vinh",
            "division_type": "xã",
            "short_codename": "quang_vinh"
          },
          {
            "name": "Xã Cao Chương",
            "code": 1471,
            "codename": "xa_cao_chuong",
            "division_type": "xã",
            "short_codename": "cao_chuong"
          },
          {
            "name": "Thị trấn Trùng Khánh",
            "code": 1477,
            "codename": "thi_tran_trung_khanh",
            "division_type": "xã",
            "short_codename": "trung_khanh"
          },
          {
            "name": "Xã Ngọc Khê",
            "code": 1480,
            "codename": "xa_ngoc_khe",
            "division_type": "xã",
            "short_codename": "ngoc_khe"
          },
          {
            "name": "Xã Ngọc Côn",
            "code": 1481,
            "codename": "xa_ngoc_con",
            "division_type": "xã",
            "short_codename": "ngoc_con"
          },
          {
            "name": "Xã Phong Nậm",
            "code": 1483,
            "codename": "xa_phong_nam",
            "division_type": "xã",
            "short_codename": "phong_nam"
          },
          {
            "name": "Xã Đình Phong",
            "code": 1489,
            "codename": "xa_dinh_phong",
            "division_type": "xã",
            "short_codename": "dinh_phong"
          },
          {
            "name": "Xã Đàm Thuỷ",
            "code": 1495,
            "codename": "xa_dam_thuy",
            "division_type": "xã",
            "short_codename": "dam_thuy"
          },
          {
            "name": "Xã Khâm Thành",
            "code": 1498,
            "codename": "xa_kham_thanh",
            "division_type": "xã",
            "short_codename": "kham_thanh"
          },
          {
            "name": "Xã Chí Viễn",
            "code": 1501,
            "codename": "xa_chi_vien",
            "division_type": "xã",
            "short_codename": "chi_vien"
          },
          {
            "name": "Xã Lăng Hiếu",
            "code": 1504,
            "codename": "xa_lang_hieu",
            "division_type": "xã",
            "short_codename": "lang_hieu"
          },
          {
            "name": "Xã Phong Châu",
            "code": 1507,
            "codename": "xa_phong_chau",
            "division_type": "xã",
            "short_codename": "phong_chau"
          },
          {
            "name": "Xã Trung Phúc",
            "code": 1516,
            "codename": "xa_trung_phuc",
            "division_type": "xã",
            "short_codename": "trung_phuc"
          },
          {
            "name": "Xã Cao Thăng",
            "code": 1519,
            "codename": "xa_cao_thang",
            "division_type": "xã",
            "short_codename": "cao_thang"
          },
          {
            "name": "Xã Đức Hồng",
            "code": 1522,
            "codename": "xa_duc_hong",
            "division_type": "xã",
            "short_codename": "duc_hong"
          },
          {
            "name": "Xã Đoài Dương",
            "code": 1525,
            "codename": "xa_doai_duong",
            "division_type": "xã",
            "short_codename": "doai_duong"
          }
        ]
      },
      {
        "name": "Huyện Hạ Lang",
        "code": 48,
        "codename": "huyen_ha_lang",
        "division_type": "huyện",
        "short_codename": "ha_lang",
        "wards": [
          {
            "name": "Xã Minh Long",
            "code": 1534,
            "codename": "xa_minh_long",
            "division_type": "xã",
            "short_codename": "minh_long"
          },
          {
            "name": "Xã Lý Quốc",
            "code": 1537,
            "codename": "xa_ly_quoc",
            "division_type": "xã",
            "short_codename": "ly_quoc"
          },
          {
            "name": "Xã Thắng Lợi",
            "code": 1540,
            "codename": "xa_thang_loi",
            "division_type": "xã",
            "short_codename": "thang_loi"
          },
          {
            "name": "Xã Đồng Loan",
            "code": 1543,
            "codename": "xa_dong_loan",
            "division_type": "xã",
            "short_codename": "dong_loan"
          },
          {
            "name": "Xã Đức Quang",
            "code": 1546,
            "codename": "xa_duc_quang",
            "division_type": "xã",
            "short_codename": "duc_quang"
          },
          {
            "name": "Xã Kim Loan",
            "code": 1549,
            "codename": "xa_kim_loan",
            "division_type": "xã",
            "short_codename": "kim_loan"
          },
          {
            "name": "Xã Quang Long",
            "code": 1552,
            "codename": "xa_quang_long",
            "division_type": "xã",
            "short_codename": "quang_long"
          },
          {
            "name": "Xã An Lạc",
            "code": 1555,
            "codename": "xa_an_lac",
            "division_type": "xã",
            "short_codename": "an_lac"
          },
          {
            "name": "Thị trấn Thanh Nhật",
            "code": 1558,
            "codename": "thi_tran_thanh_nhat",
            "division_type": "xã",
            "short_codename": "thanh_nhat"
          },
          {
            "name": "Xã Vinh Quý",
            "code": 1561,
            "codename": "xa_vinh_quy",
            "division_type": "xã",
            "short_codename": "vinh_quy"
          },
          {
            "name": "Xã Thống Nhất",
            "code": 1564,
            "codename": "xa_thong_nhat",
            "division_type": "xã",
            "short_codename": "thong_nhat"
          },
          {
            "name": "Xã Cô Ngân",
            "code": 1567,
            "codename": "xa_co_ngan",
            "division_type": "xã",
            "short_codename": "co_ngan"
          },
          {
            "name": "Xã Thị Hoa",
            "code": 1573,
            "codename": "xa_thi_hoa",
            "division_type": "xã",
            "short_codename": "thi_hoa"
          }
        ]
      },
      {
        "name": "Huyện Quảng Hòa",
        "code": 49,
        "codename": "huyen_quang_hoa",
        "division_type": "huyện",
        "short_codename": "quang_hoa",
        "wards": [
          {
            "name": "Xã Quốc Toản",
            "code": 1474,
            "codename": "xa_quoc_toan",
            "division_type": "xã",
            "short_codename": "quoc_toan"
          },
          {
            "name": "Thị trấn Quảng Uyên",
            "code": 1576,
            "codename": "thi_tran_quang_uyen",
            "division_type": "xã",
            "short_codename": "quang_uyen"
          },
          {
            "name": "Xã Phi Hải",
            "code": 1579,
            "codename": "xa_phi_hai",
            "division_type": "xã",
            "short_codename": "phi_hai"
          },
          {
            "name": "Xã Quảng Hưng",
            "code": 1582,
            "codename": "xa_quang_hung",
            "division_type": "xã",
            "short_codename": "quang_hung"
          },
          {
            "name": "Xã Độc Lập",
            "code": 1594,
            "codename": "xa_doc_lap",
            "division_type": "xã",
            "short_codename": "doc_lap"
          },
          {
            "name": "Xã Cai Bộ",
            "code": 1597,
            "codename": "xa_cai_bo",
            "division_type": "xã",
            "short_codename": "cai_bo"
          },
          {
            "name": "Xã Phúc Sen",
            "code": 1603,
            "codename": "xa_phuc_sen",
            "division_type": "xã",
            "short_codename": "phuc_sen"
          },
          {
            "name": "Xã Chí Thảo",
            "code": 1606,
            "codename": "xa_chi_thao",
            "division_type": "xã",
            "short_codename": "chi_thao"
          },
          {
            "name": "Xã Tự Do",
            "code": 1609,
            "codename": "xa_tu_do",
            "division_type": "xã",
            "short_codename": "tu_do"
          },
          {
            "name": "Xã Hồng Quang",
            "code": 1615,
            "codename": "xa_hong_quang",
            "division_type": "xã",
            "short_codename": "hong_quang"
          },
          {
            "name": "Xã Ngọc Động",
            "code": 1618,
            "codename": "xa_ngoc_dong",
            "division_type": "xã",
            "short_codename": "ngoc_dong"
          },
          {
            "name": "Xã Hạnh Phúc",
            "code": 1624,
            "codename": "xa_hanh_phuc",
            "division_type": "xã",
            "short_codename": "hanh_phuc"
          },
          {
            "name": "Thị trấn Tà Lùng",
            "code": 1627,
            "codename": "thi_tran_ta_lung",
            "division_type": "xã",
            "short_codename": "ta_lung"
          },
          {
            "name": "Xã Bế Văn Đàn",
            "code": 1630,
            "codename": "xa_be_van_dan",
            "division_type": "xã",
            "short_codename": "be_van_dan"
          },
          {
            "name": "Xã Cách Linh",
            "code": 1636,
            "codename": "xa_cach_linh",
            "division_type": "xã",
            "short_codename": "cach_linh"
          },
          {
            "name": "Xã Đại Sơn",
            "code": 1639,
            "codename": "xa_dai_son",
            "division_type": "xã",
            "short_codename": "dai_son"
          },
          {
            "name": "Xã Tiên Thành",
            "code": 1645,
            "codename": "xa_tien_thanh",
            "division_type": "xã",
            "short_codename": "tien_thanh"
          },
          {
            "name": "Thị trấn Hoà Thuận",
            "code": 1648,
            "codename": "thi_tran_hoa_thuan",
            "division_type": "xã",
            "short_codename": "hoa_thuan"
          },
          {
            "name": "Xã Mỹ Hưng",
            "code": 1651,
            "codename": "xa_my_hung",
            "division_type": "xã",
            "short_codename": "my_hung"
          }
        ]
      },
      {
        "name": "Huyện Hoà An",
        "code": 51,
        "codename": "huyen_hoa_an",
        "division_type": "huyện",
        "short_codename": "hoa_an",
        "wards": [
          {
            "name": "Thị trấn Nước Hai",
            "code": 1654,
            "codename": "thi_tran_nuoc_hai",
            "division_type": "xã",
            "short_codename": "nuoc_hai"
          },
          {
            "name": "Xã Dân Chủ",
            "code": 1657,
            "codename": "xa_dan_chu",
            "division_type": "xã",
            "short_codename": "dan_chu"
          },
          {
            "name": "Xã Nam Tuấn",
            "code": 1660,
            "codename": "xa_nam_tuan",
            "division_type": "xã",
            "short_codename": "nam_tuan"
          },
          {
            "name": "Xã Đại Tiến",
            "code": 1666,
            "codename": "xa_dai_tien",
            "division_type": "xã",
            "short_codename": "dai_tien"
          },
          {
            "name": "Xã Đức Long",
            "code": 1669,
            "codename": "xa_duc_long",
            "division_type": "xã",
            "short_codename": "duc_long"
          },
          {
            "name": "Xã Ngũ Lão",
            "code": 1672,
            "codename": "xa_ngu_lao",
            "division_type": "xã",
            "short_codename": "ngu_lao"
          },
          {
            "name": "Xã Trương Lương",
            "code": 1675,
            "codename": "xa_truong_luong",
            "division_type": "xã",
            "short_codename": "truong_luong"
          },
          {
            "name": "Xã Hồng Việt",
            "code": 1687,
            "codename": "xa_hong_viet",
            "division_type": "xã",
            "short_codename": "hong_viet"
          },
          {
            "name": "Xã Hoàng Tung",
            "code": 1696,
            "codename": "xa_hoang_tung",
            "division_type": "xã",
            "short_codename": "hoang_tung"
          },
          {
            "name": "Xã Nguyễn Huệ",
            "code": 1699,
            "codename": "xa_nguyen_hue",
            "division_type": "xã",
            "short_codename": "nguyen_hue"
          },
          {
            "name": "Xã Quang Trung",
            "code": 1702,
            "codename": "xa_quang_trung",
            "division_type": "xã",
            "short_codename": "quang_trung"
          },
          {
            "name": "Xã Bạch Đằng",
            "code": 1708,
            "codename": "xa_bach_dang",
            "division_type": "xã",
            "short_codename": "bach_dang"
          },
          {
            "name": "Xã Bình Dương",
            "code": 1711,
            "codename": "xa_binh_duong",
            "division_type": "xã",
            "short_codename": "binh_duong"
          },
          {
            "name": "Xã Lê Chung",
            "code": 1714,
            "codename": "xa_le_chung",
            "division_type": "xã",
            "short_codename": "le_chung"
          },
          {
            "name": "Xã Hồng Nam",
            "code": 1723,
            "codename": "xa_hong_nam",
            "division_type": "xã",
            "short_codename": "hong_nam"
          }
        ]
      },
      {
        "name": "Huyện Nguyên Bình",
        "code": 52,
        "codename": "huyen_nguyen_binh",
        "division_type": "huyện",
        "short_codename": "nguyen_binh",
        "wards": [
          {
            "name": "Thị trấn Nguyên Bình",
            "code": 1726,
            "codename": "thi_tran_nguyen_binh",
            "division_type": "xã",
            "short_codename": "nguyen_binh"
          },
          {
            "name": "Thị trấn Tĩnh Túc",
            "code": 1729,
            "codename": "thi_tran_tinh_tuc",
            "division_type": "xã",
            "short_codename": "tinh_tuc"
          },
          {
            "name": "Xã Yên Lạc",
            "code": 1732,
            "codename": "xa_yen_lac",
            "division_type": "xã",
            "short_codename": "yen_lac"
          },
          {
            "name": "Xã Triệu Nguyên",
            "code": 1735,
            "codename": "xa_trieu_nguyen",
            "division_type": "xã",
            "short_codename": "trieu_nguyen"
          },
          {
            "name": "Xã Ca Thành",
            "code": 1738,
            "codename": "xa_ca_thanh",
            "division_type": "xã",
            "short_codename": "ca_thanh"
          },
          {
            "name": "Xã Vũ Nông",
            "code": 1744,
            "codename": "xa_vu_nong",
            "division_type": "xã",
            "short_codename": "vu_nong"
          },
          {
            "name": "Xã Minh Tâm",
            "code": 1747,
            "codename": "xa_minh_tam",
            "division_type": "xã",
            "short_codename": "minh_tam"
          },
          {
            "name": "Xã Thể Dục",
            "code": 1750,
            "codename": "xa_the_duc",
            "division_type": "xã",
            "short_codename": "the_duc"
          },
          {
            "name": "Xã Mai Long",
            "code": 1756,
            "codename": "xa_mai_long",
            "division_type": "xã",
            "short_codename": "mai_long"
          },
          {
            "name": "Xã Vũ Minh",
            "code": 1762,
            "codename": "xa_vu_minh",
            "division_type": "xã",
            "short_codename": "vu_minh"
          },
          {
            "name": "Xã Hoa Thám",
            "code": 1765,
            "codename": "xa_hoa_tham",
            "division_type": "xã",
            "short_codename": "hoa_tham"
          },
          {
            "name": "Xã Phan Thanh",
            "code": 1768,
            "codename": "xa_phan_thanh",
            "division_type": "xã",
            "short_codename": "phan_thanh"
          },
          {
            "name": "Xã Quang Thành",
            "code": 1771,
            "codename": "xa_quang_thanh",
            "division_type": "xã",
            "short_codename": "quang_thanh"
          },
          {
            "name": "Xã Tam Kim",
            "code": 1774,
            "codename": "xa_tam_kim",
            "division_type": "xã",
            "short_codename": "tam_kim"
          },
          {
            "name": "Xã Thành Công",
            "code": 1777,
            "codename": "xa_thanh_cong",
            "division_type": "xã",
            "short_codename": "thanh_cong"
          },
          {
            "name": "Xã Thịnh Vượng",
            "code": 1780,
            "codename": "xa_thinh_vuong",
            "division_type": "xã",
            "short_codename": "thinh_vuong"
          },
          {
            "name": "Xã Hưng Đạo",
            "code": 1783,
            "codename": "xa_hung_dao",
            "division_type": "xã",
            "short_codename": "hung_dao"
          }
        ]
      },
      {
        "name": "Huyện Thạch An",
        "code": 53,
        "codename": "huyen_thach_an",
        "division_type": "huyện",
        "short_codename": "thach_an",
        "wards": [
          {
            "name": "Thị trấn Đông Khê",
            "code": 1786,
            "codename": "thi_tran_dong_khe",
            "division_type": "xã",
            "short_codename": "dong_khe"
          },
          {
            "name": "Xã Canh Tân",
            "code": 1789,
            "codename": "xa_canh_tan",
            "division_type": "xã",
            "short_codename": "canh_tan"
          },
          {
            "name": "Xã Kim Đồng",
            "code": 1792,
            "codename": "xa_kim_dong",
            "division_type": "xã",
            "short_codename": "kim_dong"
          },
          {
            "name": "Xã Minh Khai",
            "code": 1795,
            "codename": "xa_minh_khai",
            "division_type": "xã",
            "short_codename": "minh_khai"
          },
          {
            "name": "Xã Đức Thông",
            "code": 1801,
            "codename": "xa_duc_thong",
            "division_type": "xã",
            "short_codename": "duc_thong"
          },
          {
            "name": "Xã Thái Cường",
            "code": 1804,
            "codename": "xa_thai_cuong",
            "division_type": "xã",
            "short_codename": "thai_cuong"
          },
          {
            "name": "Xã Vân Trình",
            "code": 1807,
            "codename": "xa_van_trinh",
            "division_type": "xã",
            "short_codename": "van_trinh"
          },
          {
            "name": "Xã Thụy Hùng",
            "code": 1810,
            "codename": "xa_thuy_hung",
            "division_type": "xã",
            "short_codename": "thuy_hung"
          },
          {
            "name": "Xã Quang Trọng",
            "code": 1813,
            "codename": "xa_quang_trong",
            "division_type": "xã",
            "short_codename": "quang_trong"
          },
          {
            "name": "Xã Trọng Con",
            "code": 1816,
            "codename": "xa_trong_con",
            "division_type": "xã",
            "short_codename": "trong_con"
          },
          {
            "name": "Xã Lê Lai",
            "code": 1819,
            "codename": "xa_le_lai",
            "division_type": "xã",
            "short_codename": "le_lai"
          },
          {
            "name": "Xã Đức Long",
            "code": 1822,
            "codename": "xa_duc_long",
            "division_type": "xã",
            "short_codename": "duc_long"
          },
          {
            "name": "Xã Lê Lợi",
            "code": 1828,
            "codename": "xa_le_loi",
            "division_type": "xã",
            "short_codename": "le_loi"
          },
          {
            "name": "Xã Đức Xuân",
            "code": 1831,
            "codename": "xa_duc_xuan",
            "division_type": "xã",
            "short_codename": "duc_xuan"
          }
        ]
      }
    ]
  },
  {
    "name": "Tỉnh Bắc Kạn",
    "code": 6,
    "codename": "tinh_bac_kan",
    "division_type": "tỉnh",
    "phone_code": 209,
    "districts": [
      {
        "name": "Thành Phố Bắc Kạn",
        "code": 58,
        "codename": "thanh_pho_bac_kan",
        "division_type": "huyện",
        "short_codename": "bac_kan",
        "wards": [
          {
            "name": "Phường Nguyễn Thị Minh Khai",
            "code": 1834,
            "codename": "phuong_nguyen_thi_minh_khai",
            "division_type": "xã",
            "short_codename": "nguyen_thi_minh_khai"
          },
          {
            "name": "Phường Sông Cầu",
            "code": 1837,
            "codename": "phuong_song_cau",
            "division_type": "xã",
            "short_codename": "song_cau"
          },
          {
            "name": "Phường Đức Xuân",
            "code": 1840,
            "codename": "phuong_duc_xuan",
            "division_type": "xã",
            "short_codename": "duc_xuan"
          },
          {
            "name": "Phường Phùng Chí Kiên",
            "code": 1843,
            "codename": "phuong_phung_chi_kien",
            "division_type": "xã",
            "short_codename": "phung_chi_kien"
          },
          {
            "name": "Phường Huyền Tụng",
            "code": 1846,
            "codename": "phuong_huyen_tung",
            "division_type": "xã",
            "short_codename": "huyen_tung"
          },
          {
            "name": "Xã Dương Quang",
            "code": 1849,
            "codename": "xa_duong_quang",
            "division_type": "xã",
            "short_codename": "duong_quang"
          },
          {
            "name": "Xã Nông Thượng",
            "code": 1852,
            "codename": "xa_nong_thuong",
            "division_type": "xã",
            "short_codename": "nong_thuong"
          },
          {
            "name": "Phường Xuất Hóa",
            "code": 1855,
            "codename": "phuong_xuat_hoa",
            "division_type": "xã",
            "short_codename": "xuat_hoa"
          }
        ]
      },
      {
        "name": "Huyện Pác Nặm",
        "code": 60,
        "codename": "huyen_pac_nam",
        "division_type": "huyện",
        "short_codename": "pac_nam",
        "wards": [
          {
            "name": "Xã Bằng Thành",
            "code": 1858,
            "codename": "xa_bang_thanh",
            "division_type": "xã",
            "short_codename": "bang_thanh"
          },
          {
            "name": "Xã Nhạn Môn",
            "code": 1861,
            "codename": "xa_nhan_mon",
            "division_type": "xã",
            "short_codename": "nhan_mon"
          },
          {
            "name": "Xã Bộc Bố",
            "code": 1864,
            "codename": "xa_boc_bo",
            "division_type": "xã",
            "short_codename": "boc_bo"
          },
          {
            "name": "Xã Công Bằng",
            "code": 1867,
            "codename": "xa_cong_bang",
            "division_type": "xã",
            "short_codename": "cong_bang"
          },
          {
            "name": "Xã Giáo Hiệu",
            "code": 1870,
            "codename": "xa_giao_hieu",
            "division_type": "xã",
            "short_codename": "giao_hieu"
          },
          {
            "name": "Xã Xuân La",
            "code": 1873,
            "codename": "xa_xuan_la",
            "division_type": "xã",
            "short_codename": "xuan_la"
          },
          {
            "name": "Xã An Thắng",
            "code": 1876,
            "codename": "xa_an_thang",
            "division_type": "xã",
            "short_codename": "an_thang"
          },
          {
            "name": "Xã Cổ Linh",
            "code": 1879,
            "codename": "xa_co_linh",
            "division_type": "xã",
            "short_codename": "co_linh"
          },
          {
            "name": "Xã Nghiên Loan",
            "code": 1882,
            "codename": "xa_nghien_loan",
            "division_type": "xã",
            "short_codename": "nghien_loan"
          },
          {
            "name": "Xã Cao Tân",
            "code": 1885,
            "codename": "xa_cao_tan",
            "division_type": "xã",
            "short_codename": "cao_tan"
          }
        ]
      },
      {
        "name": "Huyện Ba Bể",
        "code": 61,
        "codename": "huyen_ba_be",
        "division_type": "huyện",
        "short_codename": "ba_be",
        "wards": [
          {
            "name": "Thị trấn Chợ Rã",
            "code": 1888,
            "codename": "thi_tran_cho_ra",
            "division_type": "xã",
            "short_codename": "cho_ra"
          },
          {
            "name": "Xã Bành Trạch",
            "code": 1891,
            "codename": "xa_banh_trach",
            "division_type": "xã",
            "short_codename": "banh_trach"
          },
          {
            "name": "Xã Phúc Lộc",
            "code": 1894,
            "codename": "xa_phuc_loc",
            "division_type": "xã",
            "short_codename": "phuc_loc"
          },
          {
            "name": "Xã Hà Hiệu",
            "code": 1897,
            "codename": "xa_ha_hieu",
            "division_type": "xã",
            "short_codename": "ha_hieu"
          },
          {
            "name": "Xã Cao Thượng",
            "code": 1900,
            "codename": "xa_cao_thuong",
            "division_type": "xã",
            "short_codename": "cao_thuong"
          },
          {
            "name": "Xã Khang Ninh",
            "code": 1906,
            "codename": "xa_khang_ninh",
            "division_type": "xã",
            "short_codename": "khang_ninh"
          },
          {
            "name": "Xã Nam Mẫu",
            "code": 1909,
            "codename": "xa_nam_mau",
            "division_type": "xã",
            "short_codename": "nam_mau"
          },
          {
            "name": "Xã Thượng Giáo",
            "code": 1912,
            "codename": "xa_thuong_giao",
            "division_type": "xã",
            "short_codename": "thuong_giao"
          },
          {
            "name": "Xã Địa Linh",
            "code": 1915,
            "codename": "xa_dia_linh",
            "division_type": "xã",
            "short_codename": "dia_linh"
          },
          {
            "name": "Xã Yến Dương",
            "code": 1918,
            "codename": "xa_yen_duong",
            "division_type": "xã",
            "short_codename": "yen_duong"
          },
          {
            "name": "Xã Chu Hương",
            "code": 1921,
            "codename": "xa_chu_huong",
            "division_type": "xã",
            "short_codename": "chu_huong"
          },
          {
            "name": "Xã Quảng Khê",
            "code": 1924,
            "codename": "xa_quang_khe",
            "division_type": "xã",
            "short_codename": "quang_khe"
          },
          {
            "name": "Xã Mỹ Phương",
            "code": 1927,
            "codename": "xa_my_phuong",
            "division_type": "xã",
            "short_codename": "my_phuong"
          },
          {
            "name": "Xã Hoàng Trĩ",
            "code": 1930,
            "codename": "xa_hoang_tri",
            "division_type": "xã",
            "short_codename": "hoang_tri"
          },
          {
            "name": "Xã Đồng Phúc",
            "code": 1933,
            "codename": "xa_dong_phuc",
            "division_type": "xã",
            "short_codename": "dong_phuc"
          }
        ]
      },
      {
        "name": "Huyện Ngân Sơn",
        "code": 62,
        "codename": "huyen_ngan_son",
        "division_type": "huyện",
        "short_codename": "ngan_son",
        "wards": [
          {
            "name": "Thị trấn Nà Phặc",
            "code": 1936,
            "codename": "thi_tran_na_phac",
            "division_type": "xã",
            "short_codename": "na_phac"
          },
          {
            "name": "Xã Thượng Ân",
            "code": 1939,
            "codename": "xa_thuong_an",
            "division_type": "xã",
            "short_codename": "thuong_an"
          },
          {
            "name": "Xã Bằng Vân",
            "code": 1942,
            "codename": "xa_bang_van",
            "division_type": "xã",
            "short_codename": "bang_van"
          },
          {
            "name": "Xã Cốc Đán",
            "code": 1945,
            "codename": "xa_coc_dan",
            "division_type": "xã",
            "short_codename": "coc_dan"
          },
          {
            "name": "Xã Trung Hoà",
            "code": 1948,
            "codename": "xa_trung_hoa",
            "division_type": "xã",
            "short_codename": "trung_hoa"
          },
          {
            "name": "Xã Đức Vân",
            "code": 1951,
            "codename": "xa_duc_van",
            "division_type": "xã",
            "short_codename": "duc_van"
          },
          {
            "name": "Thị trấn Vân Tùng",
            "code": 1954,
            "codename": "thi_tran_van_tung",
            "division_type": "xã",
            "short_codename": "van_tung"
          },
          {
            "name": "Xã Thượng Quan",
            "code": 1957,
            "codename": "xa_thuong_quan",
            "division_type": "xã",
            "short_codename": "thuong_quan"
          },
          {
            "name": "Xã Hiệp Lực",
            "code": 1960,
            "codename": "xa_hiep_luc",
            "division_type": "xã",
            "short_codename": "hiep_luc"
          },
          {
            "name": "Xã Thuần Mang",
            "code": 1963,
            "codename": "xa_thuan_mang",
            "division_type": "xã",
            "short_codename": "thuan_mang"
          }
        ]
      },
      {
        "name": "Huyện Bạch Thông",
        "code": 63,
        "codename": "huyen_bach_thong",
        "division_type": "huyện",
        "short_codename": "bach_thong",
        "wards": [
          {
            "name": "Thị trấn Phủ Thông",
            "code": 1969,
            "codename": "thi_tran_phu_thong",
            "division_type": "xã",
            "short_codename": "phu_thong"
          },
          {
            "name": "Xã Vi Hương",
            "code": 1975,
            "codename": "xa_vi_huong",
            "division_type": "xã",
            "short_codename": "vi_huong"
          },
          {
            "name": "Xã Sĩ Bình",
            "code": 1978,
            "codename": "xa_si_binh",
            "division_type": "xã",
            "short_codename": "si_binh"
          },
          {
            "name": "Xã Vũ Muộn",
            "code": 1981,
            "codename": "xa_vu_muon",
            "division_type": "xã",
            "short_codename": "vu_muon"
          },
          {
            "name": "Xã Đôn Phong",
            "code": 1984,
            "codename": "xa_don_phong",
            "division_type": "xã",
            "short_codename": "don_phong"
          },
          {
            "name": "Xã Lục Bình",
            "code": 1990,
            "codename": "xa_luc_binh",
            "division_type": "xã",
            "short_codename": "luc_binh"
          },
          {
            "name": "Xã Tân Tú",
            "code": 1993,
            "codename": "xa_tan_tu",
            "division_type": "xã",
            "short_codename": "tan_tu"
          },
          {
            "name": "Xã Nguyên Phúc",
            "code": 1999,
            "codename": "xa_nguyen_phuc",
            "division_type": "xã",
            "short_codename": "nguyen_phuc"
          },
          {
            "name": "Xã Cao Sơn",
            "code": 2002,
            "codename": "xa_cao_son",
            "division_type": "xã",
            "short_codename": "cao_son"
          },
          {
            "name": "Xã Quân Hà",
            "code": 2005,
            "codename": "xa_quan_ha",
            "division_type": "xã",
            "short_codename": "quan_ha"
          },
          {
            "name": "Xã Cẩm Giàng",
            "code": 2008,
            "codename": "xa_cam_giang",
            "division_type": "xã",
            "short_codename": "cam_giang"
          },
          {
            "name": "Xã Mỹ Thanh",
            "code": 2011,
            "codename": "xa_my_thanh",
            "division_type": "xã",
            "short_codename": "my_thanh"
          },
          {
            "name": "Xã Dương Phong",
            "code": 2014,
            "codename": "xa_duong_phong",
            "division_type": "xã",
            "short_codename": "duong_phong"
          },
          {
            "name": "Xã Quang Thuận",
            "code": 2017,
            "codename": "xa_quang_thuan",
            "division_type": "xã",
            "short_codename": "quang_thuan"
          }
        ]
      },
      {
        "name": "Huyện Chợ Đồn",
        "code": 64,
        "codename": "huyen_cho_don",
        "division_type": "huyện",
        "short_codename": "cho_don",
        "wards": [
          {
            "name": "Thị trấn Bằng Lũng",
            "code": 2020,
            "codename": "thi_tran_bang_lung",
            "division_type": "xã",
            "short_codename": "bang_lung"
          },
          {
            "name": "Xã Xuân Lạc",
            "code": 2023,
            "codename": "xa_xuan_lac",
            "division_type": "xã",
            "short_codename": "xuan_lac"
          },
          {
            "name": "Xã Nam Cường",
            "code": 2026,
            "codename": "xa_nam_cuong",
            "division_type": "xã",
            "short_codename": "nam_cuong"
          },
          {
            "name": "Xã Đồng Lạc",
            "code": 2029,
            "codename": "xa_dong_lac",
            "division_type": "xã",
            "short_codename": "dong_lac"
          },
          {
            "name": "Xã Tân Lập",
            "code": 2032,
            "codename": "xa_tan_lap",
            "division_type": "xã",
            "short_codename": "tan_lap"
          },
          {
            "name": "Xã Bản Thi",
            "code": 2035,
            "codename": "xa_ban_thi",
            "division_type": "xã",
            "short_codename": "ban_thi"
          },
          {
            "name": "Xã Quảng Bạch",
            "code": 2038,
            "codename": "xa_quang_bach",
            "division_type": "xã",
            "short_codename": "quang_bach"
          },
          {
            "name": "Xã Bằng Phúc",
            "code": 2041,
            "codename": "xa_bang_phuc",
            "division_type": "xã",
            "short_codename": "bang_phuc"
          },
          {
            "name": "Xã Yên Thịnh",
            "code": 2044,
            "codename": "xa_yen_thinh",
            "division_type": "xã",
            "short_codename": "yen_thinh"
          },
          {
            "name": "Xã Yên Thượng",
            "code": 2047,
            "codename": "xa_yen_thuong",
            "division_type": "xã",
            "short_codename": "yen_thuong"
          },
          {
            "name": "Xã Phương Viên",
            "code": 2050,
            "codename": "xa_phuong_vien",
            "division_type": "xã",
            "short_codename": "phuong_vien"
          },
          {
            "name": "Xã Ngọc Phái",
            "code": 2053,
            "codename": "xa_ngoc_phai",
            "division_type": "xã",
            "short_codename": "ngoc_phai"
          },
          {
            "name": "Xã Đồng Thắng",
            "code": 2059,
            "codename": "xa_dong_thang",
            "division_type": "xã",
            "short_codename": "dong_thang"
          },
          {
            "name": "Xã Lương Bằng",
            "code": 2062,
            "codename": "xa_luong_bang",
            "division_type": "xã",
            "short_codename": "luong_bang"
          },
          {
            "name": "Xã Bằng Lãng",
            "code": 2065,
            "codename": "xa_bang_lang",
            "division_type": "xã",
            "short_codename": "bang_lang"
          },
          {
            "name": "Xã Đại Sảo",
            "code": 2068,
            "codename": "xa_dai_sao",
            "division_type": "xã",
            "short_codename": "dai_sao"
          },
          {
            "name": "Xã Nghĩa Tá",
            "code": 2071,
            "codename": "xa_nghia_ta",
            "division_type": "xã",
            "short_codename": "nghia_ta"
          },
          {
            "name": "Xã Yên Mỹ",
            "code": 2077,
            "codename": "xa_yen_my",
            "division_type": "xã",
            "short_codename": "yen_my"
          },
          {
            "name": "Xã Bình Trung",
            "code": 2080,
            "codename": "xa_binh_trung",
            "division_type": "xã",
            "short_codename": "binh_trung"
          },
          {
            "name": "Xã Yên Phong",
            "code": 2083,
            "codename": "xa_yen_phong",
            "division_type": "xã",
            "short_codename": "yen_phong"
          }
        ]
      },
      {
        "name": "Huyện Chợ Mới",
        "code": 65,
        "codename": "huyen_cho_moi",
        "division_type": "huyện",
        "short_codename": "cho_moi",
        "wards": [
          {
            "name": "Thị trấn Đồng Tâm",
            "code": 2086,
            "codename": "thi_tran_dong_tam",
            "division_type": "xã",
            "short_codename": "dong_tam"
          },
          {
            "name": "Xã Tân Sơn",
            "code": 2089,
            "codename": "xa_tan_son",
            "division_type": "xã",
            "short_codename": "tan_son"
          },
          {
            "name": "Xã Thanh Vận",
            "code": 2092,
            "codename": "xa_thanh_van",
            "division_type": "xã",
            "short_codename": "thanh_van"
          },
          {
            "name": "Xã Mai Lạp",
            "code": 2095,
            "codename": "xa_mai_lap",
            "division_type": "xã",
            "short_codename": "mai_lap"
          },
          {
            "name": "Xã Hoà Mục",
            "code": 2098,
            "codename": "xa_hoa_muc",
            "division_type": "xã",
            "short_codename": "hoa_muc"
          },
          {
            "name": "Xã Thanh Mai",
            "code": 2101,
            "codename": "xa_thanh_mai",
            "division_type": "xã",
            "short_codename": "thanh_mai"
          },
          {
            "name": "Xã Cao Kỳ",
            "code": 2104,
            "codename": "xa_cao_ky",
            "division_type": "xã",
            "short_codename": "cao_ky"
          },
          {
            "name": "Xã Nông Hạ",
            "code": 2107,
            "codename": "xa_nong_ha",
            "division_type": "xã",
            "short_codename": "nong_ha"
          },
          {
            "name": "Xã Yên Cư",
            "code": 2110,
            "codename": "xa_yen_cu",
            "division_type": "xã",
            "short_codename": "yen_cu"
          },
          {
            "name": "Xã Thanh Thịnh",
            "code": 2113,
            "codename": "xa_thanh_thinh",
            "division_type": "xã",
            "short_codename": "thanh_thinh"
          },
          {
            "name": "Xã Yên Hân",
            "code": 2116,
            "codename": "xa_yen_han",
            "division_type": "xã",
            "short_codename": "yen_han"
          },
          {
            "name": "Xã Như Cố",
            "code": 2122,
            "codename": "xa_nhu_co",
            "division_type": "xã",
            "short_codename": "nhu_co"
          },
          {
            "name": "Xã Bình Văn",
            "code": 2125,
            "codename": "xa_binh_van",
            "division_type": "xã",
            "short_codename": "binh_van"
          },
          {
            "name": "Xã Quảng Chu",
            "code": 2131,
            "codename": "xa_quang_chu",
            "division_type": "xã",
            "short_codename": "quang_chu"
          }
        ]
      },
      {
        "name": "Huyện Na Rì",
        "code": 66,
        "codename": "huyen_na_ri",
        "division_type": "huyện",
        "short_codename": "na_ri",
        "wards": [
          {
            "name": "Xã Văn Vũ",
            "code": 2137,
            "codename": "xa_van_vu",
            "division_type": "xã",
            "short_codename": "van_vu"
          },
          {
            "name": "Xã Văn Lang",
            "code": 2140,
            "codename": "xa_van_lang",
            "division_type": "xã",
            "short_codename": "van_lang"
          },
          {
            "name": "Xã Lương Thượng",
            "code": 2143,
            "codename": "xa_luong_thuong",
            "division_type": "xã",
            "short_codename": "luong_thuong"
          },
          {
            "name": "Xã Kim Hỷ",
            "code": 2146,
            "codename": "xa_kim_hy",
            "division_type": "xã",
            "short_codename": "kim_hy"
          },
          {
            "name": "Xã Cường Lợi",
            "code": 2152,
            "codename": "xa_cuong_loi",
            "division_type": "xã",
            "short_codename": "cuong_loi"
          },
          {
            "name": "Thị trấn Yến Lạc",
            "code": 2155,
            "codename": "thi_tran_yen_lac",
            "division_type": "xã",
            "short_codename": "yen_lac"
          },
          {
            "name": "Xã Kim Lư",
            "code": 2158,
            "codename": "xa_kim_lu",
            "division_type": "xã",
            "short_codename": "kim_lu"
          },
          {
            "name": "Xã Sơn Thành",
            "code": 2161,
            "codename": "xa_son_thanh",
            "division_type": "xã",
            "short_codename": "son_thanh"
          },
          {
            "name": "Xã Văn Minh",
            "code": 2170,
            "codename": "xa_van_minh",
            "division_type": "xã",
            "short_codename": "van_minh"
          },
          {
            "name": "Xã Côn Minh",
            "code": 2173,
            "codename": "xa_con_minh",
            "division_type": "xã",
            "short_codename": "con_minh"
          },
          {
            "name": "Xã Cư Lễ",
            "code": 2176,
            "codename": "xa_cu_le",
            "division_type": "xã",
            "short_codename": "cu_le"
          },
          {
            "name": "Xã Trần Phú",
            "code": 2179,
            "codename": "xa_tran_phu",
            "division_type": "xã",
            "short_codename": "tran_phu"
          },
          {
            "name": "Xã Quang Phong",
            "code": 2185,
            "codename": "xa_quang_phong",
            "division_type": "xã",
            "short_codename": "quang_phong"
          },
          {
            "name": "Xã Dương Sơn",
            "code": 2188,
            "codename": "xa_duong_son",
            "division_type": "xã",
            "short_codename": "duong_son"
          },
          {
            "name": "Xã Xuân Dương",
            "code": 2191,
            "codename": "xa_xuan_duong",
            "division_type": "xã",
            "short_codename": "xuan_duong"
          },
          {
            "name": "Xã Đổng Xá",
            "code": 2194,
            "codename": "xa_dong_xa",
            "division_type": "xã",
            "short_codename": "dong_xa"
          },
          {
            "name": "Xã Liêm Thuỷ",
            "code": 2197,
            "codename": "xa_liem_thuy",
            "division_type": "xã",
            "short_codename": "liem_thuy"
          }
        ]
      }
    ]
  },
  {
    "name": "Tỉnh Tuyên Quang",
    "code": 8,
    "codename": "tinh_tuyen_quang",
    "division_type": "tỉnh",
    "phone_code": 207,
    "districts": [
      {
        "name": "Thành phố Tuyên Quang",
        "code": 70,
        "codename": "thanh_pho_tuyen_quang",
        "division_type": "huyện",
        "short_codename": "tuyen_quang",
        "wards": [
          {
            "name": "Phường Phan Thiết",
            "code": 2200,
            "codename": "phuong_phan_thiet",
            "division_type": "xã",
            "short_codename": "phan_thiet"
          },
          {
            "name": "Phường Minh Xuân",
            "code": 2203,
            "codename": "phuong_minh_xuan",
            "division_type": "xã",
            "short_codename": "minh_xuan"
          },
          {
            "name": "Phường Tân Quang",
            "code": 2206,
            "codename": "phuong_tan_quang",
            "division_type": "xã",
            "short_codename": "tan_quang"
          },
          {
            "name": "Xã Tràng Đà",
            "code": 2209,
            "codename": "xa_trang_da",
            "division_type": "xã",
            "short_codename": "trang_da"
          },
          {
            "name": "Phường Nông Tiến",
            "code": 2212,
            "codename": "phuong_nong_tien",
            "division_type": "xã",
            "short_codename": "nong_tien"
          },
          {
            "name": "Phường Ỷ La",
            "code": 2215,
            "codename": "phuong_y_la",
            "division_type": "xã",
            "short_codename": "y_la"
          },
          {
            "name": "Phường Tân Hà",
            "code": 2216,
            "codename": "phuong_tan_ha",
            "division_type": "xã",
            "short_codename": "tan_ha"
          },
          {
            "name": "Phường Hưng Thành",
            "code": 2218,
            "codename": "phuong_hung_thanh",
            "division_type": "xã",
            "short_codename": "hung_thanh"
          },
          {
            "name": "Xã Kim Phú",
            "code": 2497,
            "codename": "xa_kim_phu",
            "division_type": "xã",
            "short_codename": "kim_phu"
          },
          {
            "name": "Xã An Khang",
            "code": 2503,
            "codename": "xa_an_khang",
            "division_type": "xã",
            "short_codename": "an_khang"
          },
          {
            "name": "Phường Mỹ Lâm",
            "code": 2509,
            "codename": "phuong_my_lam",
            "division_type": "xã",
            "short_codename": "my_lam"
          },
          {
            "name": "Phường An Tường",
            "code": 2512,
            "codename": "phuong_an_tuong",
            "division_type": "xã",
            "short_codename": "an_tuong"
          },
          {
            "name": "Xã Lưỡng Vượng",
            "code": 2515,
            "codename": "xa_luong_vuong",
            "division_type": "xã",
            "short_codename": "luong_vuong"
          },
          {
            "name": "Xã Thái Long",
            "code": 2521,
            "codename": "xa_thai_long",
            "division_type": "xã",
            "short_codename": "thai_long"
          },
          {
            "name": "Phường Đội Cấn",
            "code": 2524,
            "codename": "phuong_doi_can",
            "division_type": "xã",
            "short_codename": "doi_can"
          }
        ]
      },
      {
        "name": "Huyện Lâm Bình",
        "code": 71,
        "codename": "huyen_lam_binh",
        "division_type": "huyện",
        "short_codename": "lam_binh",
        "wards": [
          {
            "name": "Xã Phúc Yên",
            "code": 2233,
            "codename": "xa_phuc_yen",
            "division_type": "xã",
            "short_codename": "phuc_yen"
          },
          {
            "name": "Xã Xuân Lập",
            "code": 2242,
            "codename": "xa_xuan_lap",
            "division_type": "xã",
            "short_codename": "xuan_lap"
          },
          {
            "name": "Xã Khuôn Hà",
            "code": 2251,
            "codename": "xa_khuon_ha",
            "division_type": "xã",
            "short_codename": "khuon_ha"
          },
          {
            "name": "Thị trấn Lăng Can",
            "code": 2266,
            "codename": "thi_tran_lang_can",
            "division_type": "xã",
            "short_codename": "lang_can"
          },
          {
            "name": "Xã Thượng Lâm",
            "code": 2269,
            "codename": "xa_thuong_lam",
            "division_type": "xã",
            "short_codename": "thuong_lam"
          },
          {
            "name": "Xã Bình An",
            "code": 2290,
            "codename": "xa_binh_an",
            "division_type": "xã",
            "short_codename": "binh_an"
          },
          {
            "name": "Xã Hồng Quang",
            "code": 2293,
            "codename": "xa_hong_quang",
            "division_type": "xã",
            "short_codename": "hong_quang"
          },
          {
            "name": "Xã Thổ Bình",
            "code": 2296,
            "codename": "xa_tho_binh",
            "division_type": "xã",
            "short_codename": "tho_binh"
          },
          {
            "name": "Xã Phúc Sơn",
            "code": 2299,
            "codename": "xa_phuc_son",
            "division_type": "xã",
            "short_codename": "phuc_son"
          },
          {
            "name": "Xã Minh Quang",
            "code": 2302,
            "codename": "xa_minh_quang",
            "division_type": "xã",
            "short_codename": "minh_quang"
          }
        ]
      },
      {
        "name": "Huyện Na Hang",
        "code": 72,
        "codename": "huyen_na_hang",
        "division_type": "huyện",
        "short_codename": "na_hang",
        "wards": [
          {
            "name": "Thị trấn Na Hang",
            "code": 2221,
            "codename": "thi_tran_na_hang",
            "division_type": "xã",
            "short_codename": "na_hang"
          },
          {
            "name": "Xã Sinh Long",
            "code": 2227,
            "codename": "xa_sinh_long",
            "division_type": "xã",
            "short_codename": "sinh_long"
          },
          {
            "name": "Xã Thượng Giáp",
            "code": 2230,
            "codename": "xa_thuong_giap",
            "division_type": "xã",
            "short_codename": "thuong_giap"
          },
          {
            "name": "Xã Thượng Nông",
            "code": 2239,
            "codename": "xa_thuong_nong",
            "division_type": "xã",
            "short_codename": "thuong_nong"
          },
          {
            "name": "Xã Côn Lôn",
            "code": 2245,
            "codename": "xa_con_lon",
            "division_type": "xã",
            "short_codename": "con_lon"
          },
          {
            "name": "Xã Yên Hoa",
            "code": 2248,
            "codename": "xa_yen_hoa",
            "division_type": "xã",
            "short_codename": "yen_hoa"
          },
          {
            "name": "Xã Hồng Thái",
            "code": 2254,
            "codename": "xa_hong_thai",
            "division_type": "xã",
            "short_codename": "hong_thai"
          },
          {
            "name": "Xã Đà Vị",
            "code": 2260,
            "codename": "xa_da_vi",
            "division_type": "xã",
            "short_codename": "da_vi"
          },
          {
            "name": "Xã Khau Tinh",
            "code": 2263,
            "codename": "xa_khau_tinh",
            "division_type": "xã",
            "short_codename": "khau_tinh"
          },
          {
            "name": "Xã Sơn Phú",
            "code": 2275,
            "codename": "xa_son_phu",
            "division_type": "xã",
            "short_codename": "son_phu"
          },
          {
            "name": "Xã Năng Khả",
            "code": 2281,
            "codename": "xa_nang_kha",
            "division_type": "xã",
            "short_codename": "nang_kha"
          },
          {
            "name": "Xã Thanh Tương",
            "code": 2284,
            "codename": "xa_thanh_tuong",
            "division_type": "xã",
            "short_codename": "thanh_tuong"
          }
        ]
      },
      {
        "name": "Huyện Chiêm Hóa",
        "code": 73,
        "codename": "huyen_chiem_hoa",
        "division_type": "huyện",
        "short_codename": "chiem_hoa",
        "wards": [
          {
            "name": "Thị trấn Vĩnh Lộc",
            "code": 2287,
            "codename": "thi_tran_vinh_loc",
            "division_type": "xã",
            "short_codename": "vinh_loc"
          },
          {
            "name": "Xã Trung Hà",
            "code": 2305,
            "codename": "xa_trung_ha",
            "division_type": "xã",
            "short_codename": "trung_ha"
          },
          {
            "name": "Xã Tân Mỹ",
            "code": 2308,
            "codename": "xa_tan_my",
            "division_type": "xã",
            "short_codename": "tan_my"
          },
          {
            "name": "Xã Hà Lang",
            "code": 2311,
            "codename": "xa_ha_lang",
            "division_type": "xã",
            "short_codename": "ha_lang"
          },
          {
            "name": "Xã Hùng Mỹ",
            "code": 2314,
            "codename": "xa_hung_my",
            "division_type": "xã",
            "short_codename": "hung_my"
          },
          {
            "name": "Xã Yên Lập",
            "code": 2317,
            "codename": "xa_yen_lap",
            "division_type": "xã",
            "short_codename": "yen_lap"
          },
          {
            "name": "Xã Tân An",
            "code": 2320,
            "codename": "xa_tan_an",
            "division_type": "xã",
            "short_codename": "tan_an"
          },
          {
            "name": "Xã Bình Phú",
            "code": 2323,
            "codename": "xa_binh_phu",
            "division_type": "xã",
            "short_codename": "binh_phu"
          },
          {
            "name": "Xã Xuân Quang",
            "code": 2326,
            "codename": "xa_xuan_quang",
            "division_type": "xã",
            "short_codename": "xuan_quang"
          },
          {
            "name": "Xã Ngọc Hội",
            "code": 2329,
            "codename": "xa_ngoc_hoi",
            "division_type": "xã",
            "short_codename": "ngoc_hoi"
          },
          {
            "name": "Xã Phú Bình",
            "code": 2332,
            "codename": "xa_phu_binh",
            "division_type": "xã",
            "short_codename": "phu_binh"
          },
          {
            "name": "Xã Hòa Phú",
            "code": 2335,
            "codename": "xa_hoa_phu",
            "division_type": "xã",
            "short_codename": "hoa_phu"
          },
          {
            "name": "Xã Phúc Thịnh",
            "code": 2338,
            "codename": "xa_phuc_thinh",
            "division_type": "xã",
            "short_codename": "phuc_thinh"
          },
          {
            "name": "Xã Kiên Đài",
            "code": 2341,
            "codename": "xa_kien_dai",
            "division_type": "xã",
            "short_codename": "kien_dai"
          },
          {
            "name": "Xã Tân Thịnh",
            "code": 2344,
            "codename": "xa_tan_thinh",
            "division_type": "xã",
            "short_codename": "tan_thinh"
          },
          {
            "name": "Xã Trung Hòa",
            "code": 2347,
            "codename": "xa_trung_hoa",
            "division_type": "xã",
            "short_codename": "trung_hoa"
          },
          {
            "name": "Xã Kim Bình",
            "code": 2350,
            "codename": "xa_kim_binh",
            "division_type": "xã",
            "short_codename": "kim_binh"
          },
          {
            "name": "Xã Hòa An",
            "code": 2353,
            "codename": "xa_hoa_an",
            "division_type": "xã",
            "short_codename": "hoa_an"
          },
          {
            "name": "Xã Vinh Quang",
            "code": 2356,
            "codename": "xa_vinh_quang",
            "division_type": "xã",
            "short_codename": "vinh_quang"
          },
          {
            "name": "Xã Tri Phú",
            "code": 2359,
            "codename": "xa_tri_phu",
            "division_type": "xã",
            "short_codename": "tri_phu"
          },
          {
            "name": "Xã Nhân Lý",
            "code": 2362,
            "codename": "xa_nhan_ly",
            "division_type": "xã",
            "short_codename": "nhan_ly"
          },
          {
            "name": "Xã Yên Nguyên",
            "code": 2365,
            "codename": "xa_yen_nguyen",
            "division_type": "xã",
            "short_codename": "yen_nguyen"
          },
          {
            "name": "Xã Linh Phú",
            "code": 2368,
            "codename": "xa_linh_phu",
            "division_type": "xã",
            "short_codename": "linh_phu"
          },
          {
            "name": "Xã Bình Nhân",
            "code": 2371,
            "codename": "xa_binh_nhan",
            "division_type": "xã",
            "short_codename": "binh_nhan"
          }
        ]
      },
      {
        "name": "Huyện Hàm Yên",
        "code": 74,
        "codename": "huyen_ham_yen",
        "division_type": "huyện",
        "short_codename": "ham_yen",
        "wards": [
          {
            "name": "Thị trấn Tân Yên",
            "code": 2374,
            "codename": "thi_tran_tan_yen",
            "division_type": "xã",
            "short_codename": "tan_yen"
          },
          {
            "name": "Xã Yên Thuận",
            "code": 2377,
            "codename": "xa_yen_thuan",
            "division_type": "xã",
            "short_codename": "yen_thuan"
          },
          {
            "name": "Xã Bạch Xa",
            "code": 2380,
            "codename": "xa_bach_xa",
            "division_type": "xã",
            "short_codename": "bach_xa"
          },
          {
            "name": "Xã Minh Khương",
            "code": 2383,
            "codename": "xa_minh_khuong",
            "division_type": "xã",
            "short_codename": "minh_khuong"
          },
          {
            "name": "Xã Yên Lâm",
            "code": 2386,
            "codename": "xa_yen_lam",
            "division_type": "xã",
            "short_codename": "yen_lam"
          },
          {
            "name": "Xã Minh Dân",
            "code": 2389,
            "codename": "xa_minh_dan",
            "division_type": "xã",
            "short_codename": "minh_dan"
          },
          {
            "name": "Xã Phù Lưu",
            "code": 2392,
            "codename": "xa_phu_luu",
            "division_type": "xã",
            "short_codename": "phu_luu"
          },
          {
            "name": "Xã Minh Hương",
            "code": 2395,
            "codename": "xa_minh_huong",
            "division_type": "xã",
            "short_codename": "minh_huong"
          },
          {
            "name": "Xã Yên Phú",
            "code": 2398,
            "codename": "xa_yen_phu",
            "division_type": "xã",
            "short_codename": "yen_phu"
          },
          {
            "name": "Xã Tân Thành",
            "code": 2401,
            "codename": "xa_tan_thanh",
            "division_type": "xã",
            "short_codename": "tan_thanh"
          },
          {
            "name": "Xã Bình Xa",
            "code": 2404,
            "codename": "xa_binh_xa",
            "division_type": "xã",
            "short_codename": "binh_xa"
          },
          {
            "name": "Xã Thái Sơn",
            "code": 2407,
            "codename": "xa_thai_son",
            "division_type": "xã",
            "short_codename": "thai_son"
          },
          {
            "name": "Xã Nhân Mục",
            "code": 2410,
            "codename": "xa_nhan_muc",
            "division_type": "xã",
            "short_codename": "nhan_muc"
          },
          {
            "name": "Xã Thành Long",
            "code": 2413,
            "codename": "xa_thanh_long",
            "division_type": "xã",
            "short_codename": "thanh_long"
          },
          {
            "name": "Xã Bằng Cốc",
            "code": 2416,
            "codename": "xa_bang_coc",
            "division_type": "xã",
            "short_codename": "bang_coc"
          },
          {
            "name": "Xã Thái Hòa",
            "code": 2419,
            "codename": "xa_thai_hoa",
            "division_type": "xã",
            "short_codename": "thai_hoa"
          },
          {
            "name": "Xã Đức Ninh",
            "code": 2422,
            "codename": "xa_duc_ninh",
            "division_type": "xã",
            "short_codename": "duc_ninh"
          },
          {
            "name": "Xã Hùng Đức",
            "code": 2425,
            "codename": "xa_hung_duc",
            "division_type": "xã",
            "short_codename": "hung_duc"
          }
        ]
      },
      {
        "name": "Huyện Yên Sơn",
        "code": 75,
        "codename": "huyen_yen_son",
        "division_type": "huyện",
        "short_codename": "yen_son",
        "wards": [
          {
            "name": "Xã Quí Quân",
            "code": 2431,
            "codename": "xa_qui_quan",
            "division_type": "xã",
            "short_codename": "qui_quan"
          },
          {
            "name": "Xã Lực Hành",
            "code": 2434,
            "codename": "xa_luc_hanh",
            "division_type": "xã",
            "short_codename": "luc_hanh"
          },
          {
            "name": "Xã Kiến Thiết",
            "code": 2437,
            "codename": "xa_kien_thiet",
            "division_type": "xã",
            "short_codename": "kien_thiet"
          },
          {
            "name": "Xã Trung Minh",
            "code": 2440,
            "codename": "xa_trung_minh",
            "division_type": "xã",
            "short_codename": "trung_minh"
          },
          {
            "name": "Xã Chiêu Yên",
            "code": 2443,
            "codename": "xa_chieu_yen",
            "division_type": "xã",
            "short_codename": "chieu_yen"
          },
          {
            "name": "Xã Trung Trực",
            "code": 2446,
            "codename": "xa_trung_truc",
            "division_type": "xã",
            "short_codename": "trung_truc"
          },
          {
            "name": "Xã Xuân Vân",
            "code": 2449,
            "codename": "xa_xuan_van",
            "division_type": "xã",
            "short_codename": "xuan_van"
          },
          {
            "name": "Xã Phúc Ninh",
            "code": 2452,
            "codename": "xa_phuc_ninh",
            "division_type": "xã",
            "short_codename": "phuc_ninh"
          },
          {
            "name": "Xã Hùng Lợi",
            "code": 2455,
            "codename": "xa_hung_loi",
            "division_type": "xã",
            "short_codename": "hung_loi"
          },
          {
            "name": "Xã Trung Sơn",
            "code": 2458,
            "codename": "xa_trung_son",
            "division_type": "xã",
            "short_codename": "trung_son"
          },
          {
            "name": "Xã Tân Tiến",
            "code": 2461,
            "codename": "xa_tan_tien",
            "division_type": "xã",
            "short_codename": "tan_tien"
          },
          {
            "name": "Xã Tứ Quận",
            "code": 2464,
            "codename": "xa_tu_quan",
            "division_type": "xã",
            "short_codename": "tu_quan"
          },
          {
            "name": "Xã Đạo Viện",
            "code": 2467,
            "codename": "xa_dao_vien",
            "division_type": "xã",
            "short_codename": "dao_vien"
          },
          {
            "name": "Xã Tân Long",
            "code": 2470,
            "codename": "xa_tan_long",
            "division_type": "xã",
            "short_codename": "tan_long"
          },
          {
            "name": "Thị trấn Yên Sơn",
            "code": 2473,
            "codename": "thi_tran_yen_son",
            "division_type": "xã",
            "short_codename": "yen_son"
          },
          {
            "name": "Xã Kim Quan",
            "code": 2476,
            "codename": "xa_kim_quan",
            "division_type": "xã",
            "short_codename": "kim_quan"
          },
          {
            "name": "Xã Lang Quán",
            "code": 2479,
            "codename": "xa_lang_quan",
            "division_type": "xã",
            "short_codename": "lang_quan"
          },
          {
            "name": "Xã Phú Thịnh",
            "code": 2482,
            "codename": "xa_phu_thinh",
            "division_type": "xã",
            "short_codename": "phu_thinh"
          },
          {
            "name": "Xã Công Đa",
            "code": 2485,
            "codename": "xa_cong_da",
            "division_type": "xã",
            "short_codename": "cong_da"
          },
          {
            "name": "Xã Trung Môn",
            "code": 2488,
            "codename": "xa_trung_mon",
            "division_type": "xã",
            "short_codename": "trung_mon"
          },
          {
            "name": "Xã Chân Sơn",
            "code": 2491,
            "codename": "xa_chan_son",
            "division_type": "xã",
            "short_codename": "chan_son"
          },
          {
            "name": "Xã Thái Bình",
            "code": 2494,
            "codename": "xa_thai_binh",
            "division_type": "xã",
            "short_codename": "thai_binh"
          },
          {
            "name": "Xã Tiến Bộ",
            "code": 2500,
            "codename": "xa_tien_bo",
            "division_type": "xã",
            "short_codename": "tien_bo"
          },
          {
            "name": "Xã Mỹ Bằng",
            "code": 2506,
            "codename": "xa_my_bang",
            "division_type": "xã",
            "short_codename": "my_bang"
          },
          {
            "name": "Xã Hoàng Khai",
            "code": 2518,
            "codename": "xa_hoang_khai",
            "division_type": "xã",
            "short_codename": "hoang_khai"
          },
          {
            "name": "Xã Nhữ Hán",
            "code": 2527,
            "codename": "xa_nhu_han",
            "division_type": "xã",
            "short_codename": "nhu_han"
          },
          {
            "name": "Xã Nhữ Khê",
            "code": 2530,
            "codename": "xa_nhu_khe",
            "division_type": "xã",
            "short_codename": "nhu_khe"
          },
          {
            "name": "Xã Đội Bình",
            "code": 2533,
            "codename": "xa_doi_binh",
            "division_type": "xã",
            "short_codename": "doi_binh"
          }
        ]
      },
      {
        "name": "Huyện Sơn Dương",
        "code": 76,
        "codename": "huyen_son_duong",
        "division_type": "huyện",
        "short_codename": "son_duong",
        "wards": [
          {
            "name": "Thị trấn Sơn Dương",
            "code": 2536,
            "codename": "thi_tran_son_duong",
            "division_type": "xã",
            "short_codename": "son_duong"
          },
          {
            "name": "Xã Trung Yên",
            "code": 2539,
            "codename": "xa_trung_yen",
            "division_type": "xã",
            "short_codename": "trung_yen"
          },
          {
            "name": "Xã Minh Thanh",
            "code": 2542,
            "codename": "xa_minh_thanh",
            "division_type": "xã",
            "short_codename": "minh_thanh"
          },
          {
            "name": "Xã Tân Trào",
            "code": 2545,
            "codename": "xa_tan_trao",
            "division_type": "xã",
            "short_codename": "tan_trao"
          },
          {
            "name": "Xã Vĩnh Lợi",
            "code": 2548,
            "codename": "xa_vinh_loi",
            "division_type": "xã",
            "short_codename": "vinh_loi"
          },
          {
            "name": "Xã Thượng Ấm",
            "code": 2551,
            "codename": "xa_thuong_am",
            "division_type": "xã",
            "short_codename": "thuong_am"
          },
          {
            "name": "Xã Bình Yên",
            "code": 2554,
            "codename": "xa_binh_yen",
            "division_type": "xã",
            "short_codename": "binh_yen"
          },
          {
            "name": "Xã Lương Thiện",
            "code": 2557,
            "codename": "xa_luong_thien",
            "division_type": "xã",
            "short_codename": "luong_thien"
          },
          {
            "name": "Xã Tú Thịnh",
            "code": 2560,
            "codename": "xa_tu_thinh",
            "division_type": "xã",
            "short_codename": "tu_thinh"
          },
          {
            "name": "Xã Cấp Tiến",
            "code": 2563,
            "codename": "xa_cap_tien",
            "division_type": "xã",
            "short_codename": "cap_tien"
          },
          {
            "name": "Xã Hợp Thành",
            "code": 2566,
            "codename": "xa_hop_thanh",
            "division_type": "xã",
            "short_codename": "hop_thanh"
          },
          {
            "name": "Xã Phúc Ứng",
            "code": 2569,
            "codename": "xa_phuc_ung",
            "division_type": "xã",
            "short_codename": "phuc_ung"
          },
          {
            "name": "Xã Đông Thọ",
            "code": 2572,
            "codename": "xa_dong_tho",
            "division_type": "xã",
            "short_codename": "dong_tho"
          },
          {
            "name": "Xã Kháng Nhật",
            "code": 2575,
            "codename": "xa_khang_nhat",
            "division_type": "xã",
            "short_codename": "khang_nhat"
          },
          {
            "name": "Xã Hợp Hòa",
            "code": 2578,
            "codename": "xa_hop_hoa",
            "division_type": "xã",
            "short_codename": "hop_hoa"
          },
          {
            "name": "Xã Quyết Thắng",
            "code": 2584,
            "codename": "xa_quyet_thang",
            "division_type": "xã",
            "short_codename": "quyet_thang"
          },
          {
            "name": "Xã Đồng Quý",
            "code": 2587,
            "codename": "xa_dong_quy",
            "division_type": "xã",
            "short_codename": "dong_quy"
          },
          {
            "name": "Xã Tân Thanh",
            "code": 2590,
            "codename": "xa_tan_thanh",
            "division_type": "xã",
            "short_codename": "tan_thanh"
          },
          {
            "name": "Xã Văn Phú",
            "code": 2596,
            "codename": "xa_van_phu",
            "division_type": "xã",
            "short_codename": "van_phu"
          },
          {
            "name": "Xã Chi Thiết",
            "code": 2599,
            "codename": "xa_chi_thiet",
            "division_type": "xã",
            "short_codename": "chi_thiet"
          },
          {
            "name": "Xã Đông Lợi",
            "code": 2602,
            "codename": "xa_dong_loi",
            "division_type": "xã",
            "short_codename": "dong_loi"
          },
          {
            "name": "Xã Thiện Kế",
            "code": 2605,
            "codename": "xa_thien_ke",
            "division_type": "xã",
            "short_codename": "thien_ke"
          },
          {
            "name": "Xã Hồng Sơn",
            "code": 2608,
            "codename": "xa_hong_son",
            "division_type": "xã",
            "short_codename": "hong_son"
          },
          {
            "name": "Xã Phú Lương",
            "code": 2611,
            "codename": "xa_phu_luong",
            "division_type": "xã",
            "short_codename": "phu_luong"
          },
          {
            "name": "Xã Ninh Lai",
            "code": 2614,
            "codename": "xa_ninh_lai",
            "division_type": "xã",
            "short_codename": "ninh_lai"
          },
          {
            "name": "Xã Đại Phú",
            "code": 2617,
            "codename": "xa_dai_phu",
            "division_type": "xã",
            "short_codename": "dai_phu"
          },
          {
            "name": "Xã Sơn Nam",
            "code": 2620,
            "codename": "xa_son_nam",
            "division_type": "xã",
            "short_codename": "son_nam"
          },
          {
            "name": "Xã Hào Phú",
            "code": 2623,
            "codename": "xa_hao_phu",
            "division_type": "xã",
            "short_codename": "hao_phu"
          },
          {
            "name": "Xã Tam Đa",
            "code": 2626,
            "codename": "xa_tam_da",
            "division_type": "xã",
            "short_codename": "tam_da"
          },
          {
            "name": "Xã Trường Sinh",
            "code": 2632,
            "codename": "xa_truong_sinh",
            "division_type": "xã",
            "short_codename": "truong_sinh"
          }
        ]
      }
    ]
  },
  {
    "name": "Tỉnh Lào Cai",
    "code": 10,
    "codename": "tinh_lao_cai",
    "division_type": "tỉnh",
    "phone_code": 214,
    "districts": [
      {
        "name": "Thành phố Lào Cai",
        "code": 80,
        "codename": "thanh_pho_lao_cai",
        "division_type": "huyện",
        "short_codename": "lao_cai",
        "wards": [
          {
            "name": "Phường Duyên Hải",
            "code": 2635,
            "codename": "phuong_duyen_hai",
            "division_type": "xã",
            "short_codename": "duyen_hai"
          },
          {
            "name": "Phường Lào Cai",
            "code": 2641,
            "codename": "phuong_lao_cai",
            "division_type": "xã",
            "short_codename": "lao_cai"
          },
          {
            "name": "Phường Cốc Lếu",
            "code": 2644,
            "codename": "phuong_coc_leu",
            "division_type": "xã",
            "short_codename": "coc_leu"
          },
          {
            "name": "Phường Kim Tân",
            "code": 2647,
            "codename": "phuong_kim_tan",
            "division_type": "xã",
            "short_codename": "kim_tan"
          },
          {
            "name": "Phường Bắc Lệnh",
            "code": 2650,
            "codename": "phuong_bac_lenh",
            "division_type": "xã",
            "short_codename": "bac_lenh"
          },
          {
            "name": "Phường Pom Hán",
            "code": 2653,
            "codename": "phuong_pom_han",
            "division_type": "xã",
            "short_codename": "pom_han"
          },
          {
            "name": "Phường Xuân Tăng",
            "code": 2656,
            "codename": "phuong_xuan_tang",
            "division_type": "xã",
            "short_codename": "xuan_tang"
          },
          {
            "name": "Phường Bình Minh",
            "code": 2658,
            "codename": "phuong_binh_minh",
            "division_type": "xã",
            "short_codename": "binh_minh"
          },
          {
            "name": "Xã Thống Nhất",
            "code": 2659,
            "codename": "xa_thong_nhat",
            "division_type": "xã",
            "short_codename": "thong_nhat"
          },
          {
            "name": "Xã Đồng Tuyển",
            "code": 2662,
            "codename": "xa_dong_tuyen",
            "division_type": "xã",
            "short_codename": "dong_tuyen"
          },
          {
            "name": "Xã Vạn Hoà",
            "code": 2665,
            "codename": "xa_van_hoa",
            "division_type": "xã",
            "short_codename": "van_hoa"
          },
          {
            "name": "Phường Bắc Cường",
            "code": 2668,
            "codename": "phuong_bac_cuong",
            "division_type": "xã",
            "short_codename": "bac_cuong"
          },
          {
            "name": "Phường Nam Cường",
            "code": 2671,
            "codename": "phuong_nam_cuong",
            "division_type": "xã",
            "short_codename": "nam_cuong"
          },
          {
            "name": "Xã Cam Đường",
            "code": 2674,
            "codename": "xa_cam_duong",
            "division_type": "xã",
            "short_codename": "cam_duong"
          },
          {
            "name": "Xã Tả Phời",
            "code": 2677,
            "codename": "xa_ta_phoi",
            "division_type": "xã",
            "short_codename": "ta_phoi"
          },
          {
            "name": "Xã Hợp Thành",
            "code": 2680,
            "codename": "xa_hop_thanh",
            "division_type": "xã",
            "short_codename": "hop_thanh"
          },
          {
            "name": "Xã Cốc San",
            "code": 2746,
            "codename": "xa_coc_san",
            "division_type": "xã",
            "short_codename": "coc_san"
          }
        ]
      },
      {
        "name": "Huyện Bát Xát",
        "code": 82,
        "codename": "huyen_bat_xat",
        "division_type": "huyện",
        "short_codename": "bat_xat",
        "wards": [
          {
            "name": "Thị trấn Bát Xát",
            "code": 2683,
            "codename": "thi_tran_bat_xat",
            "division_type": "xã",
            "short_codename": "bat_xat"
          },
          {
            "name": "Xã A Mú Sung",
            "code": 2686,
            "codename": "xa_a_mu_sung",
            "division_type": "xã",
            "short_codename": "a_mu_sung"
          },
          {
            "name": "Xã Nậm Chạc",
            "code": 2689,
            "codename": "xa_nam_chac",
            "division_type": "xã",
            "short_codename": "nam_chac"
          },
          {
            "name": "Xã A Lù",
            "code": 2692,
            "codename": "xa_a_lu",
            "division_type": "xã",
            "short_codename": "a_lu"
          },
          {
            "name": "Xã Trịnh Tường",
            "code": 2695,
            "codename": "xa_trinh_tuong",
            "division_type": "xã",
            "short_codename": "trinh_tuong"
          },
          {
            "name": "Xã Y Tý",
            "code": 2701,
            "codename": "xa_y_ty",
            "division_type": "xã",
            "short_codename": "y_ty"
          },
          {
            "name": "Xã Cốc Mỳ",
            "code": 2704,
            "codename": "xa_coc_my",
            "division_type": "xã",
            "short_codename": "coc_my"
          },
          {
            "name": "Xã Dền Sáng",
            "code": 2707,
            "codename": "xa_den_sang",
            "division_type": "xã",
            "short_codename": "den_sang"
          },
          {
            "name": "Xã Bản Vược",
            "code": 2710,
            "codename": "xa_ban_vuoc",
            "division_type": "xã",
            "short_codename": "ban_vuoc"
          },
          {
            "name": "Xã Sàng Ma Sáo",
            "code": 2713,
            "codename": "xa_sang_ma_sao",
            "division_type": "xã",
            "short_codename": "sang_ma_sao"
          },
          {
            "name": "Xã Bản Qua",
            "code": 2716,
            "codename": "xa_ban_qua",
            "division_type": "xã",
            "short_codename": "ban_qua"
          },
          {
            "name": "Xã Mường Vi",
            "code": 2719,
            "codename": "xa_muong_vi",
            "division_type": "xã",
            "short_codename": "muong_vi"
          },
          {
            "name": "Xã Dền Thàng",
            "code": 2722,
            "codename": "xa_den_thang",
            "division_type": "xã",
            "short_codename": "den_thang"
          },
          {
            "name": "Xã Bản Xèo",
            "code": 2725,
            "codename": "xa_ban_xeo",
            "division_type": "xã",
            "short_codename": "ban_xeo"
          },
          {
            "name": "Xã Mường Hum",
            "code": 2728,
            "codename": "xa_muong_hum",
            "division_type": "xã",
            "short_codename": "muong_hum"
          },
          {
            "name": "Xã Trung Lèng Hồ",
            "code": 2731,
            "codename": "xa_trung_leng_ho",
            "division_type": "xã",
            "short_codename": "trung_leng_ho"
          },
          {
            "name": "Xã Quang Kim",
            "code": 2734,
            "codename": "xa_quang_kim",
            "division_type": "xã",
            "short_codename": "quang_kim"
          },
          {
            "name": "Xã Pa Cheo",
            "code": 2737,
            "codename": "xa_pa_cheo",
            "division_type": "xã",
            "short_codename": "pa_cheo"
          },
          {
            "name": "Xã Nậm Pung",
            "code": 2740,
            "codename": "xa_nam_pung",
            "division_type": "xã",
            "short_codename": "nam_pung"
          },
          {
            "name": "Xã Phìn Ngan",
            "code": 2743,
            "codename": "xa_phin_ngan",
            "division_type": "xã",
            "short_codename": "phin_ngan"
          },
          {
            "name": "Xã Tòng Sành",
            "code": 2749,
            "codename": "xa_tong_sanh",
            "division_type": "xã",
            "short_codename": "tong_sanh"
          }
        ]
      },
      {
        "name": "Huyện Mường Khương",
        "code": 83,
        "codename": "huyen_muong_khuong",
        "division_type": "huyện",
        "short_codename": "muong_khuong",
        "wards": [
          {
            "name": "Xã Pha Long",
            "code": 2752,
            "codename": "xa_pha_long",
            "division_type": "xã",
            "short_codename": "pha_long"
          },
          {
            "name": "Xã Tả Ngải Chồ",
            "code": 2755,
            "codename": "xa_ta_ngai_cho",
            "division_type": "xã",
            "short_codename": "ta_ngai_cho"
          },
          {
            "name": "Xã Tung Chung Phố",
            "code": 2758,
            "codename": "xa_tung_chung_pho",
            "division_type": "xã",
            "short_codename": "tung_chung_pho"
          },
          {
            "name": "Thị trấn Mường Khương",
            "code": 2761,
            "codename": "thi_tran_muong_khuong",
            "division_type": "xã",
            "short_codename": "muong_khuong"
          },
          {
            "name": "Xã Dìn Chin",
            "code": 2764,
            "codename": "xa_din_chin",
            "division_type": "xã",
            "short_codename": "din_chin"
          },
          {
            "name": "Xã Tả Gia Khâu",
            "code": 2767,
            "codename": "xa_ta_gia_khau",
            "division_type": "xã",
            "short_codename": "ta_gia_khau"
          },
          {
            "name": "Xã Nậm Chảy",
            "code": 2770,
            "codename": "xa_nam_chay",
            "division_type": "xã",
            "short_codename": "nam_chay"
          },
          {
            "name": "Xã Nấm Lư",
            "code": 2773,
            "codename": "xa_nam_lu",
            "division_type": "xã",
            "short_codename": "nam_lu"
          },
          {
            "name": "Xã Lùng Khấu Nhin",
            "code": 2776,
            "codename": "xa_lung_khau_nhin",
            "division_type": "xã",
            "short_codename": "lung_khau_nhin"
          },
          {
            "name": "Xã Thanh Bình",
            "code": 2779,
            "codename": "xa_thanh_binh",
            "division_type": "xã",
            "short_codename": "thanh_binh"
          },
          {
            "name": "Xã Cao Sơn",
            "code": 2782,
            "codename": "xa_cao_son",
            "division_type": "xã",
            "short_codename": "cao_son"
          },
          {
            "name": "Xã Lùng Vai",
            "code": 2785,
            "codename": "xa_lung_vai",
            "division_type": "xã",
            "short_codename": "lung_vai"
          },
          {
            "name": "Xã Bản Lầu",
            "code": 2788,
            "codename": "xa_ban_lau",
            "division_type": "xã",
            "short_codename": "ban_lau"
          },
          {
            "name": "Xã La Pan Tẩn",
            "code": 2791,
            "codename": "xa_la_pan_tan",
            "division_type": "xã",
            "short_codename": "la_pan_tan"
          },
          {
            "name": "Xã Tả Thàng",
            "code": 2794,
            "codename": "xa_ta_thang",
            "division_type": "xã",
            "short_codename": "ta_thang"
          },
          {
            "name": "Xã Bản Sen",
            "code": 2797,
            "codename": "xa_ban_sen",
            "division_type": "xã",
            "short_codename": "ban_sen"
          }
        ]
      },
      {
        "name": "Huyện Si Ma Cai",
        "code": 84,
        "codename": "huyen_si_ma_cai",
        "division_type": "huyện",
        "short_codename": "si_ma_cai",
        "wards": [
          {
            "name": "Xã Nàn Sán",
            "code": 2800,
            "codename": "xa_nan_san",
            "division_type": "xã",
            "short_codename": "nan_san"
          },
          {
            "name": "Xã Thào Chư Phìn",
            "code": 2803,
            "codename": "xa_thao_chu_phin",
            "division_type": "xã",
            "short_codename": "thao_chu_phin"
          },
          {
            "name": "Xã Bản Mế",
            "code": 2806,
            "codename": "xa_ban_me",
            "division_type": "xã",
            "short_codename": "ban_me"
          },
          {
            "name": "Thị trấn Si Ma Cai",
            "code": 2809,
            "codename": "thi_tran_si_ma_cai",
            "division_type": "xã",
            "short_codename": "si_ma_cai"
          },
          {
            "name": "Xã Sán Chải",
            "code": 2812,
            "codename": "xa_san_chai",
            "division_type": "xã",
            "short_codename": "san_chai"
          },
          {
            "name": "Xã Lùng Thẩn",
            "code": 2818,
            "codename": "xa_lung_than",
            "division_type": "xã",
            "short_codename": "lung_than"
          },
          {
            "name": "Xã Cán Cấu",
            "code": 2821,
            "codename": "xa_can_cau",
            "division_type": "xã",
            "short_codename": "can_cau"
          },
          {
            "name": "Xã Sín Chéng",
            "code": 2824,
            "codename": "xa_sin_cheng",
            "division_type": "xã",
            "short_codename": "sin_cheng"
          },
          {
            "name": "Xã Quan Hồ Thẩn",
            "code": 2827,
            "codename": "xa_quan_ho_than",
            "division_type": "xã",
            "short_codename": "quan_ho_than"
          },
          {
            "name": "Xã Nàn Xín",
            "code": 2836,
            "codename": "xa_nan_xin",
            "division_type": "xã",
            "short_codename": "nan_xin"
          }
        ]
      },
      {
        "name": "Huyện Bắc Hà",
        "code": 85,
        "codename": "huyen_bac_ha",
        "division_type": "huyện",
        "short_codename": "bac_ha",
        "wards": [
          {
            "name": "Thị trấn Bắc Hà",
            "code": 2839,
            "codename": "thi_tran_bac_ha",
            "division_type": "xã",
            "short_codename": "bac_ha"
          },
          {
            "name": "Xã Lùng Cải",
            "code": 2842,
            "codename": "xa_lung_cai",
            "division_type": "xã",
            "short_codename": "lung_cai"
          },
          {
            "name": "Xã Lùng Phình",
            "code": 2848,
            "codename": "xa_lung_phinh",
            "division_type": "xã",
            "short_codename": "lung_phinh"
          },
          {
            "name": "Xã Tả Van Chư",
            "code": 2851,
            "codename": "xa_ta_van_chu",
            "division_type": "xã",
            "short_codename": "ta_van_chu"
          },
          {
            "name": "Xã Tả Củ Tỷ",
            "code": 2854,
            "codename": "xa_ta_cu_ty",
            "division_type": "xã",
            "short_codename": "ta_cu_ty"
          },
          {
            "name": "Xã Thải Giàng Phố",
            "code": 2857,
            "codename": "xa_thai_giang_pho",
            "division_type": "xã",
            "short_codename": "thai_giang_pho"
          },
          {
            "name": "Xã Hoàng Thu Phố",
            "code": 2863,
            "codename": "xa_hoang_thu_pho",
            "division_type": "xã",
            "short_codename": "hoang_thu_pho"
          },
          {
            "name": "Xã Bản Phố",
            "code": 2866,
            "codename": "xa_ban_pho",
            "division_type": "xã",
            "short_codename": "ban_pho"
          },
          {
            "name": "Xã Bản Liền",
            "code": 2869,
            "codename": "xa_ban_lien",
            "division_type": "xã",
            "short_codename": "ban_lien"
          },
          {
            "name": "Xã Na Hối",
            "code": 2875,
            "codename": "xa_na_hoi",
            "division_type": "xã",
            "short_codename": "na_hoi"
          },
          {
            "name": "Xã Cốc Ly",
            "code": 2878,
            "codename": "xa_coc_ly",
            "division_type": "xã",
            "short_codename": "coc_ly"
          },
          {
            "name": "Xã Nậm Mòn",
            "code": 2881,
            "codename": "xa_nam_mon",
            "division_type": "xã",
            "short_codename": "nam_mon"
          },
          {
            "name": "Xã Nậm Đét",
            "code": 2884,
            "codename": "xa_nam_det",
            "division_type": "xã",
            "short_codename": "nam_det"
          },
          {
            "name": "Xã Nậm Khánh",
            "code": 2887,
            "codename": "xa_nam_khanh",
            "division_type": "xã",
            "short_codename": "nam_khanh"
          },
          {
            "name": "Xã Bảo Nhai",
            "code": 2890,
            "codename": "xa_bao_nhai",
            "division_type": "xã",
            "short_codename": "bao_nhai"
          },
          {
            "name": "Xã Nậm Lúc",
            "code": 2893,
            "codename": "xa_nam_luc",
            "division_type": "xã",
            "short_codename": "nam_luc"
          },
          {
            "name": "Xã Cốc Lầu",
            "code": 2896,
            "codename": "xa_coc_lau",
            "division_type": "xã",
            "short_codename": "coc_lau"
          },
          {
            "name": "Xã Bản Cái",
            "code": 2899,
            "codename": "xa_ban_cai",
            "division_type": "xã",
            "short_codename": "ban_cai"
          }
        ]
      },
      {
        "name": "Huyện Bảo Thắng",
        "code": 86,
        "codename": "huyen_bao_thang",
        "division_type": "huyện",
        "short_codename": "bao_thang",
        "wards": [
          {
            "name": "Thị trấn N.T Phong Hải",
            "code": 2902,
            "codename": "thi_tran_n_t_phong_hai",
            "division_type": "xã",
            "short_codename": "n_t_phong_hai"
          },
          {
            "name": "Thị trấn Phố Lu",
            "code": 2905,
            "codename": "thi_tran_pho_lu",
            "division_type": "xã",
            "short_codename": "pho_lu"
          },
          {
            "name": "Thị trấn Tằng Loỏng",
            "code": 2908,
            "codename": "thi_tran_tang_loong",
            "division_type": "xã",
            "short_codename": "tang_loong"
          },
          {
            "name": "Xã Bản Phiệt",
            "code": 2911,
            "codename": "xa_ban_phiet",
            "division_type": "xã",
            "short_codename": "ban_phiet"
          },
          {
            "name": "Xã Bản Cầm",
            "code": 2914,
            "codename": "xa_ban_cam",
            "division_type": "xã",
            "short_codename": "ban_cam"
          },
          {
            "name": "Xã Thái Niên",
            "code": 2917,
            "codename": "xa_thai_nien",
            "division_type": "xã",
            "short_codename": "thai_nien"
          },
          {
            "name": "Xã Phong Niên",
            "code": 2920,
            "codename": "xa_phong_nien",
            "division_type": "xã",
            "short_codename": "phong_nien"
          },
          {
            "name": "Xã Gia Phú",
            "code": 2923,
            "codename": "xa_gia_phu",
            "division_type": "xã",
            "short_codename": "gia_phu"
          },
          {
            "name": "Xã Xuân Quang",
            "code": 2926,
            "codename": "xa_xuan_quang",
            "division_type": "xã",
            "short_codename": "xuan_quang"
          },
          {
            "name": "Xã Sơn Hải",
            "code": 2929,
            "codename": "xa_son_hai",
            "division_type": "xã",
            "short_codename": "son_hai"
          },
          {
            "name": "Xã Xuân Giao",
            "code": 2932,
            "codename": "xa_xuan_giao",
            "division_type": "xã",
            "short_codename": "xuan_giao"
          },
          {
            "name": "Xã Trì Quang",
            "code": 2935,
            "codename": "xa_tri_quang",
            "division_type": "xã",
            "short_codename": "tri_quang"
          },
          {
            "name": "Xã Sơn Hà",
            "code": 2938,
            "codename": "xa_son_ha",
            "division_type": "xã",
            "short_codename": "son_ha"
          },
          {
            "name": "Xã Phú Nhuận",
            "code": 2944,
            "codename": "xa_phu_nhuan",
            "division_type": "xã",
            "short_codename": "phu_nhuan"
          }
        ]
      },
      {
        "name": "Huyện Bảo Yên",
        "code": 87,
        "codename": "huyen_bao_yen",
        "division_type": "huyện",
        "short_codename": "bao_yen",
        "wards": [
          {
            "name": "Thị trấn Phố Ràng",
            "code": 2947,
            "codename": "thi_tran_pho_rang",
            "division_type": "xã",
            "short_codename": "pho_rang"
          },
          {
            "name": "Xã Tân Tiến",
            "code": 2950,
            "codename": "xa_tan_tien",
            "division_type": "xã",
            "short_codename": "tan_tien"
          },
          {
            "name": "Xã Nghĩa Đô",
            "code": 2953,
            "codename": "xa_nghia_do",
            "division_type": "xã",
            "short_codename": "nghia_do"
          },
          {
            "name": "Xã Vĩnh Yên",
            "code": 2956,
            "codename": "xa_vinh_yen",
            "division_type": "xã",
            "short_codename": "vinh_yen"
          },
          {
            "name": "Xã Điện Quan",
            "code": 2959,
            "codename": "xa_dien_quan",
            "division_type": "xã",
            "short_codename": "dien_quan"
          },
          {
            "name": "Xã Xuân Hoà",
            "code": 2962,
            "codename": "xa_xuan_hoa",
            "division_type": "xã",
            "short_codename": "xuan_hoa"
          },
          {
            "name": "Xã Tân Dương",
            "code": 2965,
            "codename": "xa_tan_duong",
            "division_type": "xã",
            "short_codename": "tan_duong"
          },
          {
            "name": "Xã Thượng Hà",
            "code": 2968,
            "codename": "xa_thuong_ha",
            "division_type": "xã",
            "short_codename": "thuong_ha"
          },
          {
            "name": "Xã Kim Sơn",
            "code": 2971,
            "codename": "xa_kim_son",
            "division_type": "xã",
            "short_codename": "kim_son"
          },
          {
            "name": "Xã Cam Cọn",
            "code": 2974,
            "codename": "xa_cam_con",
            "division_type": "xã",
            "short_codename": "cam_con"
          },
          {
            "name": "Xã Minh Tân",
            "code": 2977,
            "codename": "xa_minh_tan",
            "division_type": "xã",
            "short_codename": "minh_tan"
          },
          {
            "name": "Xã Xuân Thượng",
            "code": 2980,
            "codename": "xa_xuan_thuong",
            "division_type": "xã",
            "short_codename": "xuan_thuong"
          },
          {
            "name": "Xã Việt Tiến",
            "code": 2983,
            "codename": "xa_viet_tien",
            "division_type": "xã",
            "short_codename": "viet_tien"
          },
          {
            "name": "Xã Yên Sơn",
            "code": 2986,
            "codename": "xa_yen_son",
            "division_type": "xã",
            "short_codename": "yen_son"
          },
          {
            "name": "Xã Bảo Hà",
            "code": 2989,
            "codename": "xa_bao_ha",
            "division_type": "xã",
            "short_codename": "bao_ha"
          },
          {
            "name": "Xã Lương Sơn",
            "code": 2992,
            "codename": "xa_luong_son",
            "division_type": "xã",
            "short_codename": "luong_son"
          },
          {
            "name": "Xã Phúc Khánh",
            "code": 2998,
            "codename": "xa_phuc_khanh",
            "division_type": "xã",
            "short_codename": "phuc_khanh"
          }
        ]
      },
      {
        "name": "Thị xã Sa Pa",
        "code": 88,
        "codename": "thi_xa_sa_pa",
        "division_type": "huyện",
        "short_codename": "sa_pa",
        "wards": [
          {
            "name": "Phường Sa Pa",
            "code": 3001,
            "codename": "phuong_sa_pa",
            "division_type": "xã",
            "short_codename": "sa_pa"
          },
          {
            "name": "Phường Sa Pả",
            "code": 3002,
            "codename": "phuong_sa_pa",
            "division_type": "xã",
            "short_codename": "sa_pa"
          },
          {
            "name": "Phường Ô Quý Hồ",
            "code": 3003,
            "codename": "phuong_o_quy_ho",
            "division_type": "xã",
            "short_codename": "o_quy_ho"
          },
          {
            "name": "Xã Ngũ Chỉ Sơn",
            "code": 3004,
            "codename": "xa_ngu_chi_son",
            "division_type": "xã",
            "short_codename": "ngu_chi_son"
          },
          {
            "name": "Phường Phan Si Păng",
            "code": 3006,
            "codename": "phuong_phan_si_pang",
            "division_type": "xã",
            "short_codename": "phan_si_pang"
          },
          {
            "name": "Xã Trung Chải",
            "code": 3010,
            "codename": "xa_trung_chai",
            "division_type": "xã",
            "short_codename": "trung_chai"
          },
          {
            "name": "Xã Tả Phìn",
            "code": 3013,
            "codename": "xa_ta_phin",
            "division_type": "xã",
            "short_codename": "ta_phin"
          },
          {
            "name": "Phường Hàm Rồng",
            "code": 3016,
            "codename": "phuong_ham_rong",
            "division_type": "xã",
            "short_codename": "ham_rong"
          },
          {
            "name": "Xã Hoàng Liên",
            "code": 3019,
            "codename": "xa_hoang_lien",
            "division_type": "xã",
            "short_codename": "hoang_lien"
          },
          {
            "name": "Xã Thanh Bình",
            "code": 3022,
            "codename": "xa_thanh_binh",
            "division_type": "xã",
            "short_codename": "thanh_binh"
          },
          {
            "name": "Phường Cầu Mây",
            "code": 3028,
            "codename": "phuong_cau_may",
            "division_type": "xã",
            "short_codename": "cau_may"
          },
          {
            "name": "Xã Mường Hoa",
            "code": 3037,
            "codename": "xa_muong_hoa",
            "division_type": "xã",
            "short_codename": "muong_hoa"
          },
          {
            "name": "Xã Tả Van",
            "code": 3040,
            "codename": "xa_ta_van",
            "division_type": "xã",
            "short_codename": "ta_van"
          },
          {
            "name": "Xã Mường Bo",
            "code": 3043,
            "codename": "xa_muong_bo",
            "division_type": "xã",
            "short_codename": "muong_bo"
          },
          {
            "name": "Xã Bản Hồ",
            "code": 3046,
            "codename": "xa_ban_ho",
            "division_type": "xã",
            "short_codename": "ban_ho"
          },
          {
            "name": "Xã Liên Minh",
            "code": 3052,
            "codename": "xa_lien_minh",
            "division_type": "xã",
            "short_codename": "lien_minh"
          }
        ]
      },
      {
        "name": "Huyện Văn Bàn",
        "code": 89,
        "codename": "huyen_van_ban",
        "division_type": "huyện",
        "short_codename": "van_ban",
        "wards": [
          {
            "name": "Thị trấn Khánh Yên",
            "code": 3055,
            "codename": "thi_tran_khanh_yen",
            "division_type": "xã",
            "short_codename": "khanh_yen"
          },
          {
            "name": "Xã Võ Lao",
            "code": 3061,
            "codename": "xa_vo_lao",
            "division_type": "xã",
            "short_codename": "vo_lao"
          },
          {
            "name": "Xã Sơn Thuỷ",
            "code": 3064,
            "codename": "xa_son_thuy",
            "division_type": "xã",
            "short_codename": "son_thuy"
          },
          {
            "name": "Xã Nậm Mả",
            "code": 3067,
            "codename": "xa_nam_ma",
            "division_type": "xã",
            "short_codename": "nam_ma"
          },
          {
            "name": "Xã Tân Thượng",
            "code": 3070,
            "codename": "xa_tan_thuong",
            "division_type": "xã",
            "short_codename": "tan_thuong"
          },
          {
            "name": "Xã Nậm Rạng",
            "code": 3073,
            "codename": "xa_nam_rang",
            "division_type": "xã",
            "short_codename": "nam_rang"
          },
          {
            "name": "Xã Nậm Chầy",
            "code": 3076,
            "codename": "xa_nam_chay",
            "division_type": "xã",
            "short_codename": "nam_chay"
          },
          {
            "name": "Xã Tân An",
            "code": 3079,
            "codename": "xa_tan_an",
            "division_type": "xã",
            "short_codename": "tan_an"
          },
          {
            "name": "Xã Khánh Yên Thượng",
            "code": 3082,
            "codename": "xa_khanh_yen_thuong",
            "division_type": "xã",
            "short_codename": "khanh_yen_thuong"
          },
          {
            "name": "Xã Nậm Xé",
            "code": 3085,
            "codename": "xa_nam_xe",
            "division_type": "xã",
            "short_codename": "nam_xe"
          },
          {
            "name": "Xã Dần Thàng",
            "code": 3088,
            "codename": "xa_dan_thang",
            "division_type": "xã",
            "short_codename": "dan_thang"
          },
          {
            "name": "Xã Chiềng Ken",
            "code": 3091,
            "codename": "xa_chieng_ken",
            "division_type": "xã",
            "short_codename": "chieng_ken"
          },
          {
            "name": "Xã Làng Giàng",
            "code": 3094,
            "codename": "xa_lang_giang",
            "division_type": "xã",
            "short_codename": "lang_giang"
          },
          {
            "name": "Xã Hoà Mạc",
            "code": 3097,
            "codename": "xa_hoa_mac",
            "division_type": "xã",
            "short_codename": "hoa_mac"
          },
          {
            "name": "Xã Khánh Yên Trung",
            "code": 3100,
            "codename": "xa_khanh_yen_trung",
            "division_type": "xã",
            "short_codename": "khanh_yen_trung"
          },
          {
            "name": "Xã Khánh Yên Hạ",
            "code": 3103,
            "codename": "xa_khanh_yen_ha",
            "division_type": "xã",
            "short_codename": "khanh_yen_ha"
          },
          {
            "name": "Xã Dương Quỳ",
            "code": 3106,
            "codename": "xa_duong_quy",
            "division_type": "xã",
            "short_codename": "duong_quy"
          },
          {
            "name": "Xã Nậm Tha",
            "code": 3109,
            "codename": "xa_nam_tha",
            "division_type": "xã",
            "short_codename": "nam_tha"
          },
          {
            "name": "Xã Minh Lương",
            "code": 3112,
            "codename": "xa_minh_luong",
            "division_type": "xã",
            "short_codename": "minh_luong"
          },
          {
            "name": "Xã Thẩm Dương",
            "code": 3115,
            "codename": "xa_tham_duong",
            "division_type": "xã",
            "short_codename": "tham_duong"
          },
          {
            "name": "Xã Liêm Phú",
            "code": 3118,
            "codename": "xa_liem_phu",
            "division_type": "xã",
            "short_codename": "liem_phu"
          },
          {
            "name": "Xã Nậm Xây",
            "code": 3121,
            "codename": "xa_nam_xay",
            "division_type": "xã",
            "short_codename": "nam_xay"
          }
        ]
      }
    ]
  }
]; // DEV only provide some addresses

export function getVNAddressesList() { // Return a copy
  return JSON.parse(JSON.stringify(vnAddresses));
}

export function getCityProvince(cityCode) {
  if(!cityCode) return undefined;

  const vnAddresses = getVNAddressesList();
  return vnAddresses.find(city => city.code == cityCode) || undefined;
}

export function getDistrict(cityCode, districtCode) {
  if(!cityCode || !districtCode) return undefined;

  const city = getCityProvince(cityCode);
  if(!city) return undefined;

  return city.districts.find(district => district.code == districtCode) || undefined;
}

export function getDistrictsOfCity(cityCode) {
  if(!cityCode) return [];

  const city = getCityProvince(cityCode);
  if(!city) return [];

  return city.districts;
}

export function getWardsOfDistrict(cityCode, districtCode) {
  if(!cityCode || !districtCode) return [];

  const city = getCityProvince(cityCode);
  if(!city) return [];

  const district = city.districts.find(district => district.code == districtCode);
  if(!district) return [];

  return district.wards;
}

export function getWard(cityCode, districtCode, wardCode) {
  if(!cityCode || !districtCode || !wardCode) return undefined;

  const city = getCityProvince(cityCode);
  if(!city) return undefined;

  const district = city.districts.find(district => district.code == districtCode);
  if(!district) return undefined;
  
  return district.wards.find(ward => ward.code == wardCode) || undefined;
}