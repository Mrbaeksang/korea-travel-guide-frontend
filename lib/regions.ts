// Backend Region enum과 동일한 구조
// Source: backend/src/main/kotlin/com/back/koreaTravelGuide/domain/user/enums/Region.kt

export type RegionValue =
  // 서울특별시
  | 'SEOUL'
  // 부산광역시
  | 'BUSAN'
  // 대구광역시
  | 'DAEGU'
  // 인천광역시
  | 'INCHEON'
  | 'BAENGNYEONG'
  | 'GANGHWA'
  // 광주광역시
  | 'GWANGJU'
  // 대전광역시
  | 'DAEJEON'
  // 울산광역시
  | 'ULSAN'
  // 세종특별자치시
  | 'SEJONG'
  // 경기도
  | 'GWACHEON'
  | 'GWANGMYEONG'
  | 'GIMPO'
  | 'SIHEUNG'
  | 'ANSAN'
  | 'BUCHEON'
  | 'UIJEONGBU'
  | 'GOYANG'
  | 'YANGJU'
  | 'PAJU'
  | 'DONGDUCHEON'
  | 'YEONCHEON'
  | 'POCHEON'
  | 'GAPYEONG'
  | 'GURI'
  | 'NAMYANGJU'
  | 'YANGPYEONG'
  | 'HANAM'
  | 'SUWON'
  | 'ANYANG'
  | 'OSAN'
  | 'HWASEONG'
  | 'SEONGNAM'
  | 'PYEONGTAEK'
  | 'UIWANG'
  | 'GUNPO'
  | 'ANSEONG'
  | 'YONGIN'
  | 'ICHEON'
  | 'YEOJU'
  // 강원특별자치도
  | 'CHEORWON'
  | 'HWACHEON'
  | 'INJE'
  | 'YANGGU'
  | 'CHUNCHEON'
  | 'HONGCHEON'
  | 'WONJU'
  | 'HOENGSEONG'
  | 'YEONGWOL'
  | 'JEONGSEON'
  | 'PYEONGCHANG'
  | 'DAEGWALLYEONG'
  | 'TAEBAEK'
  | 'SOKCHO'
  | 'YANGYANG'
  | 'GANGNEUNG'
  | 'DONGHAE'
  | 'SAMCHEOK'
  // 충청북도
  | 'CHUNGJU'
  | 'JINCHEON'
  | 'EUMSEONG'
  | 'JECHEON'
  | 'DANYANG'
  | 'CHEONGJU'
  | 'BOEUN'
  | 'GOESAN'
  | 'JEUNGPYEONG'
  | 'CHUPUNGNYEONG'
  | 'YEONGDONG'
  | 'OKCHEON'
  // 충청남도
  | 'SEOSAN'
  | 'TAEAN'
  | 'DANGJIN'
  | 'HONGSEONG'
  | 'BORYEONG'
  | 'SEOCHEON'
  | 'CHEONAN'
  | 'ASAN'
  | 'YESAN'
  | 'GONGJU'
  | 'GYERYONG'
  | 'BUYEO'
  | 'CHEONGYANG'
  | 'GEUMSAN'
  | 'NONSAN'
  // 전북특별자치도
  | 'JEONJU'
  | 'IKSAN'
  | 'JEONGEUP'
  | 'WANJU'
  | 'JANGSU'
  | 'MUJU'
  | 'JINAN'
  | 'NAMWON'
  | 'IMSIL'
  | 'SUNCHANG'
  | 'GUNSAN'
  | 'GIMJE'
  | 'GOCHANG'
  | 'BUAN'
  // 전라남도
  | 'HAMPYEONG'
  | 'YEONGGWANG'
  | 'JINDO'
  | 'WANDO'
  | 'HAENAM'
  | 'GANGJIN'
  | 'JANGHEUNG'
  | 'YEOSU'
  | 'GWANGYANG'
  | 'GOHEUNG'
  | 'BOSEONG'
  | 'SUNCHEON'
  | 'JANGSEONG'
  | 'NAJU'
  | 'DAMYANG'
  | 'HWASUN'
  | 'GURYE'
  | 'GOKSEONG'
  | 'HEUKSANDO'
  | 'MOKPO'
  | 'YEONGAM'
  | 'SINAN'
  | 'MUAN'
  // 경상북도
  | 'ULLEUNGDO'
  | 'DOKDO'
  | 'ULJIN'
  | 'YEONGDEOK'
  | 'POHANG'
  | 'GYEONGJU'
  | 'MUNGYEONG'
  | 'SANGJU'
  | 'YECHEON'
  | 'YEONGJU'
  | 'BONGHWA'
  | 'YEONGYANG'
  | 'ANDONG'
  | 'UISEONG'
  | 'CHEONGSONG'
  | 'GIMCHEON'
  | 'GUMI'
  | 'GUNWI'
  | 'GORYEONG'
  | 'SEONGJU'
  | 'YEONGCHEON'
  | 'GYEONGSAN'
  | 'CHEONGDO'
  | 'CHILGOK'
  // 경상남도
  | 'CHANGWON'
  | 'GIMHAE'
  | 'TONGYEONG'
  | 'SACHEON'
  | 'GEOJE'
  | 'GOSEONG'
  | 'NAMHAE'
  | 'HAMYANG'
  | 'GEOCHANG'
  | 'HAPCHEON'
  | 'MIRYANG'
  | 'UIRYEONG'
  | 'HAMAN'
  | 'CHANGNYEONG'
  | 'JINJU'
  | 'SANCHEONG'
  | 'HADONG'
  | 'YANGSAN'
  // 제주특별자치도
  | 'JEJU'
  | 'SEOGWIPO'
  | 'SEONGSAN'
  | 'SEONGPANAK'
  | 'GOSAN'
  | 'IEODO'
  | 'CHUJADO'

export interface Region {
  value: RegionValue
  displayName: string
}

export interface RegionGroup {
  province: string
  regions: Region[]
}

// 시/도별로 그룹화된 지역 데이터
export const REGIONS: RegionGroup[] = [
  {
    province: '서울특별시',
    regions: [{ value: 'SEOUL', displayName: '서울' }],
  },
  {
    province: '부산광역시',
    regions: [{ value: 'BUSAN', displayName: '부산' }],
  },
  {
    province: '대구광역시',
    regions: [{ value: 'DAEGU', displayName: '대구' }],
  },
  {
    province: '인천광역시',
    regions: [
      { value: 'INCHEON', displayName: '인천' },
      { value: 'BAENGNYEONG', displayName: '백령도' },
      { value: 'GANGHWA', displayName: '강화' },
    ],
  },
  {
    province: '광주광역시',
    regions: [{ value: 'GWANGJU', displayName: '광주' }],
  },
  {
    province: '대전광역시',
    regions: [{ value: 'DAEJEON', displayName: '대전' }],
  },
  {
    province: '울산광역시',
    regions: [{ value: 'ULSAN', displayName: '울산' }],
  },
  {
    province: '세종특별자치시',
    regions: [{ value: 'SEJONG', displayName: '세종' }],
  },
  {
    province: '경기도',
    regions: [
      { value: 'GWACHEON', displayName: '과천' },
      { value: 'GWANGMYEONG', displayName: '광명' },
      { value: 'GIMPO', displayName: '김포' },
      { value: 'SIHEUNG', displayName: '시흥' },
      { value: 'ANSAN', displayName: '안산' },
      { value: 'BUCHEON', displayName: '부천' },
      { value: 'UIJEONGBU', displayName: '의정부' },
      { value: 'GOYANG', displayName: '고양' },
      { value: 'YANGJU', displayName: '양주' },
      { value: 'PAJU', displayName: '파주' },
      { value: 'DONGDUCHEON', displayName: '동두천' },
      { value: 'YEONCHEON', displayName: '연천' },
      { value: 'POCHEON', displayName: '포천' },
      { value: 'GAPYEONG', displayName: '가평' },
      { value: 'GURI', displayName: '구리' },
      { value: 'NAMYANGJU', displayName: '남양주' },
      { value: 'YANGPYEONG', displayName: '양평' },
      { value: 'HANAM', displayName: '하남' },
      { value: 'SUWON', displayName: '수원' },
      { value: 'ANYANG', displayName: '안양' },
      { value: 'OSAN', displayName: '오산' },
      { value: 'HWASEONG', displayName: '화성' },
      { value: 'SEONGNAM', displayName: '성남' },
      { value: 'PYEONGTAEK', displayName: '평택' },
      { value: 'UIWANG', displayName: '의왕' },
      { value: 'GUNPO', displayName: '군포' },
      { value: 'ANSEONG', displayName: '안성' },
      { value: 'YONGIN', displayName: '용인' },
      { value: 'ICHEON', displayName: '이천' },
      { value: 'YEOJU', displayName: '여주' },
    ],
  },
  {
    province: '강원특별자치도',
    regions: [
      { value: 'CHEORWON', displayName: '철원' },
      { value: 'HWACHEON', displayName: '화천' },
      { value: 'INJE', displayName: '인제' },
      { value: 'YANGGU', displayName: '양구' },
      { value: 'CHUNCHEON', displayName: '춘천' },
      { value: 'HONGCHEON', displayName: '홍천' },
      { value: 'WONJU', displayName: '원주' },
      { value: 'HOENGSEONG', displayName: '횡성' },
      { value: 'YEONGWOL', displayName: '영월' },
      { value: 'JEONGSEON', displayName: '정선' },
      { value: 'PYEONGCHANG', displayName: '평창' },
      { value: 'DAEGWALLYEONG', displayName: '대관령' },
      { value: 'TAEBAEK', displayName: '태백' },
      { value: 'SOKCHO', displayName: '속초' },
      { value: 'YANGYANG', displayName: '양양' },
      { value: 'GANGNEUNG', displayName: '강릉' },
      { value: 'DONGHAE', displayName: '동해' },
      { value: 'SAMCHEOK', displayName: '삼척' },
    ],
  },
  {
    province: '충청북도',
    regions: [
      { value: 'CHUNGJU', displayName: '충주' },
      { value: 'JINCHEON', displayName: '진천' },
      { value: 'EUMSEONG', displayName: '음성' },
      { value: 'JECHEON', displayName: '제천' },
      { value: 'DANYANG', displayName: '단양' },
      { value: 'CHEONGJU', displayName: '청주' },
      { value: 'BOEUN', displayName: '보은' },
      { value: 'GOESAN', displayName: '괴산' },
      { value: 'JEUNGPYEONG', displayName: '증평' },
      { value: 'CHUPUNGNYEONG', displayName: '추풍령' },
      { value: 'YEONGDONG', displayName: '영동' },
      { value: 'OKCHEON', displayName: '옥천' },
    ],
  },
  {
    province: '충청남도',
    regions: [
      { value: 'SEOSAN', displayName: '서산' },
      { value: 'TAEAN', displayName: '태안' },
      { value: 'DANGJIN', displayName: '당진' },
      { value: 'HONGSEONG', displayName: '홍성' },
      { value: 'BORYEONG', displayName: '보령' },
      { value: 'SEOCHEON', displayName: '서천' },
      { value: 'CHEONAN', displayName: '천안' },
      { value: 'ASAN', displayName: '아산' },
      { value: 'YESAN', displayName: '예산' },
      { value: 'GONGJU', displayName: '공주' },
      { value: 'GYERYONG', displayName: '계룡' },
      { value: 'BUYEO', displayName: '부여' },
      { value: 'CHEONGYANG', displayName: '청양' },
      { value: 'GEUMSAN', displayName: '금산' },
      { value: 'NONSAN', displayName: '논산' },
    ],
  },
  {
    province: '전북특별자치도',
    regions: [
      { value: 'JEONJU', displayName: '전주' },
      { value: 'IKSAN', displayName: '익산' },
      { value: 'JEONGEUP', displayName: '정읍' },
      { value: 'WANJU', displayName: '완주' },
      { value: 'JANGSU', displayName: '장수' },
      { value: 'MUJU', displayName: '무주' },
      { value: 'JINAN', displayName: '진안' },
      { value: 'NAMWON', displayName: '남원' },
      { value: 'IMSIL', displayName: '임실' },
      { value: 'SUNCHANG', displayName: '순창' },
      { value: 'GUNSAN', displayName: '군산' },
      { value: 'GIMJE', displayName: '김제' },
      { value: 'GOCHANG', displayName: '고창' },
      { value: 'BUAN', displayName: '부안' },
    ],
  },
  {
    province: '전라남도',
    regions: [
      { value: 'HAMPYEONG', displayName: '함평' },
      { value: 'YEONGGWANG', displayName: '영광' },
      { value: 'JINDO', displayName: '진도' },
      { value: 'WANDO', displayName: '완도' },
      { value: 'HAENAM', displayName: '해남' },
      { value: 'GANGJIN', displayName: '강진' },
      { value: 'JANGHEUNG', displayName: '장흥' },
      { value: 'YEOSU', displayName: '여수' },
      { value: 'GWANGYANG', displayName: '광양' },
      { value: 'GOHEUNG', displayName: '고흥' },
      { value: 'BOSEONG', displayName: '보성' },
      { value: 'SUNCHEON', displayName: '순천' },
      { value: 'JANGSEONG', displayName: '장성' },
      { value: 'NAJU', displayName: '나주' },
      { value: 'DAMYANG', displayName: '담양' },
      { value: 'HWASUN', displayName: '화순' },
      { value: 'GURYE', displayName: '구례' },
      { value: 'GOKSEONG', displayName: '곡성' },
      { value: 'HEUKSANDO', displayName: '흑산도' },
      { value: 'MOKPO', displayName: '목포' },
      { value: 'YEONGAM', displayName: '영암' },
      { value: 'SINAN', displayName: '신안' },
      { value: 'MUAN', displayName: '무안' },
    ],
  },
  {
    province: '경상북도',
    regions: [
      { value: 'ULLEUNGDO', displayName: '울릉도' },
      { value: 'DOKDO', displayName: '독도' },
      { value: 'ULJIN', displayName: '울진' },
      { value: 'YEONGDEOK', displayName: '영덕' },
      { value: 'POHANG', displayName: '포항' },
      { value: 'GYEONGJU', displayName: '경주' },
      { value: 'MUNGYEONG', displayName: '문경' },
      { value: 'SANGJU', displayName: '상주' },
      { value: 'YECHEON', displayName: '예천' },
      { value: 'YEONGJU', displayName: '영주' },
      { value: 'BONGHWA', displayName: '봉화' },
      { value: 'YEONGYANG', displayName: '영양' },
      { value: 'ANDONG', displayName: '안동' },
      { value: 'UISEONG', displayName: '의성' },
      { value: 'CHEONGSONG', displayName: '청송' },
      { value: 'GIMCHEON', displayName: '김천' },
      { value: 'GUMI', displayName: '구미' },
      { value: 'GUNWI', displayName: '군위' },
      { value: 'GORYEONG', displayName: '고령' },
      { value: 'SEONGJU', displayName: '성주' },
      { value: 'YEONGCHEON', displayName: '영천' },
      { value: 'GYEONGSAN', displayName: '경산' },
      { value: 'CHEONGDO', displayName: '청도' },
      { value: 'CHILGOK', displayName: '칠곡' },
    ],
  },
  {
    province: '경상남도',
    regions: [
      { value: 'CHANGWON', displayName: '창원' },
      { value: 'GIMHAE', displayName: '김해' },
      { value: 'TONGYEONG', displayName: '통영' },
      { value: 'SACHEON', displayName: '사천' },
      { value: 'GEOJE', displayName: '거제' },
      { value: 'GOSEONG', displayName: '고성' },
      { value: 'NAMHAE', displayName: '남해' },
      { value: 'HAMYANG', displayName: '함양' },
      { value: 'GEOCHANG', displayName: '거창' },
      { value: 'HAPCHEON', displayName: '합천' },
      { value: 'MIRYANG', displayName: '밀양' },
      { value: 'UIRYEONG', displayName: '의령' },
      { value: 'HAMAN', displayName: '함안' },
      { value: 'CHANGNYEONG', displayName: '창녕' },
      { value: 'JINJU', displayName: '진주' },
      { value: 'SANCHEONG', displayName: '산청' },
      { value: 'HADONG', displayName: '하동' },
      { value: 'YANGSAN', displayName: '양산' },
    ],
  },
  {
    province: '제주특별자치도',
    regions: [
      { value: 'JEJU', displayName: '제주' },
      { value: 'SEOGWIPO', displayName: '서귀포' },
      { value: 'SEONGSAN', displayName: '성산' },
      { value: 'SEONGPANAK', displayName: '성판악' },
      { value: 'GOSAN', displayName: '고산' },
      { value: 'IEODO', displayName: '이어도' },
      { value: 'CHUJADO', displayName: '추자도' },
    ],
  },
]

// 모든 지역을 평평한 배열로
export const ALL_REGIONS: Region[] = REGIONS.flatMap((group) => group.regions)

// Region value로 displayName 찾기
export function getRegionDisplayName(value: RegionValue | string | null): string {
  if (!value) return ''
  const region = ALL_REGIONS.find((r) => r.value === value)
  return region?.displayName || value
}

// DisplayName으로 region value 찾기
export function getRegionValue(displayName: string): RegionValue | null {
  const region = ALL_REGIONS.find((r) => r.displayName === displayName)
  return region?.value || null
}
