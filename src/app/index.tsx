import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';

export default function HomeScreen() {
  const appName = "Project OIL"; 

  const [isMuted, setIsMuted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('main'); // 'main', 'roulette', 'selector', 'calculator'
  
  // 💡 인원 추가가 자유로운 동적 확장형 데이터 구조
  const [peopleData] = useState([
    { id: 1, name: '황지민', efficiency: 17.3, fuelType: '경유', role: 'DRIVER 01', color: '#4ADE80' }, // 연두
    { id: 2, name: '김기현', efficiency: 12.2, fuelType: '고급휘발유', role: 'DRIVER 02', color: '#38BDF8' }, // 하늘
    { id: 3, name: '유승현', efficiency: 15.0, fuelType: '휘발유', role: 'DRIVER 03', color: '#FACC15' }, // 노랑
  ]);
  
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [distance, setDistance] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [tollFee, setTollFee] = useState('');
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  
  // 룰렛 상태 및 애니메이션
  const [rouletteWinner, setRouletteWinner] = useState<any>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinAnimation] = useState(new Animated.Value(0));

  // 상단 메뉴 기능
  const handleDescription = () => setModalVisible(true);
  const handleSettings = () => {
    setIsMuted(!isMuted);
    Alert.alert("앱 설정", isMuted ? "소리 켜기 🔊" : "소리 끄기 🔇");
  };
  const handleBack = () => {
    if (currentScreen !== 'main') {
      setCurrentScreen('main');
      setSelectedPerson(null);
      setCalculationResult(null);
      setRouletteWinner(null);
    } else {
      Alert.alert("알림", "이미 첫 번째 메인 화면입니다.");
    }
  };

  // 룰렛 회전 알고리즘
  const runRoulette = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setRouletteWinner(null);

    const totalCount = peopleData.length;
    const randomIndex = Math.floor(Math.random() * totalCount);
    const winner = peopleData[randomIndex];

    const segmentAngle = 360 / totalCount;
    const targetDegree = 1800 + (360 - (randomIndex * segmentAngle + segmentAngle / 2));

    spinAnimation.setValue(0);
    Animated.timing(spinAnimation, {
      toValue: targetDegree,
      duration: 3000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setRouletteWinner(winner);
      setIsSpinning(false);
    });
  };

  const spinInterpolate = spinAnimation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  // 동적 부채꼴 경로 생성 함수
  const createSectorPath = (index: number, total: number, radius = 92) => {
    const angle = 360 / total;
    const startAngle = index * angle;
    const endAngle = (index + 1) * angle;

    const center = 100;
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  // 유류비 계산 공식
  const calculateOilCost = () => {
    if (!selectedPerson) {
      Alert.alert("오류", "먼저 인물을 선택해주세요!");
      return;
    }
    if (!distance || !fuelPrice) {
      Alert.alert("입력 오류", "이동 거리와 현재 유가를 올바르게 입력해주세요.");
      return;
    }

    let distNum = parseFloat(distance);
    let priceNum = parseFloat(fuelPrice);
    let tollNum = tollFee ? parseFloat(tollFee) : 0;

    if (isRoundTrip) {
      distNum = distNum * 2;
      tollNum = tollNum * 2;
    }

    const efficiency = selectedPerson.efficiency;
    const fuelNeeded = distNum / efficiency;
    const totalFuelCost = fuelNeeded * priceNum;
    const finalTotal = Math.round(totalFuelCost + tollNum);

    setCalculationResult({
      person: selectedPerson.name,
      tripType: isRoundTrip ? '왕복' : '편도',
      totalCost: finalTotal.toLocaleString() + "원",
      distance: distNum,
      fuelUsed: fuelNeeded.toFixed(2),
      fuelCostOnly: Math.round(totalFuelCost).toLocaleString() + "원",
      toll: tollNum.toLocaleString() + "원",
      efficiency: efficiency,
      fuelPrice: priceNum.toLocaleString()
    });
    setResultModalVisible(true);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <StatusBar style="dark" />

      {/* --- 상단 네비게이션 바 (이미지와 동일한 배치) --- */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandCircle}><Text style={styles.brandCircleText}>운</Text></View>
          <View>
            <Text style={styles.appNameText}>{appName}</Text>
            <Text style={styles.appSubText}>DRIVE TOGETHER</Text>
          </View>
        </View>

        <View style={styles.topRightGroup}>
          <TouchableOpacity onPress={handleDescription}><Text style={styles.topMenuText}>설명</Text></TouchableOpacity>
          <Text style={styles.topDivider}>|</Text>
          <TouchableOpacity onPress={handleSettings}><Text style={styles.topMenuText}>{isMuted ? "소리 꺼짐" : "소리 켜짐"}</Text></TouchableOpacity>
          <Text style={styles.topDivider}>|</Text>
          <TouchableOpacity onPress={handleBack}><Text style={styles.topMenuText}>뒤로가기</Text></TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* ================= 메인 화면 (첨부 이미지 감성 완벽 구현) ================= */}
        {currentScreen === 'main' && (
          <View style={styles.content}>
            <View style={styles.heroSection}>
              <Text style={styles.heroTag}>A LITTLE LUCK, A BETTER DRIVE</Text>
              <Text style={styles.heroTitle}>누구 차로{"\n"}떠나볼까요?</Text>
              <Text style={styles.heroDesc}>운전자는 가볍게 정하고,{"\n"}기름값은 꼼꼼하게 계산해요.</Text>
            </View>

            {/* 카드 1: 연두색 파스텔톤 룰렛 카드 (이미지 스타일) */}
            <TouchableOpacity 
              style={styles.pastelCardGreen} 
              onPress={() => setCurrentScreen('roulette')}
            >
              <View style={styles.cardLeftContent}>
                <View style={styles.badgePill}><Text style={styles.badgePillText}>01 / RANDOM PICK</Text></View>
                <Text style={styles.pastelCardTitle}>룰렛</Text>
                <Text style={styles.pastelCardDesc}>오늘의 운전자,{"\n"}행운에 맡겨볼까요?</Text>
                <View style={styles.actionRow}>
                  <Text style={styles.actionIcon}>⊙</Text>
                  <Text style={styles.actionText}>룰렛으로 정하기</Text>
                </View>
              </View>

              {/* 카드 우측 미니 룰렛 일러스트 */}
              <View style={styles.miniWheelWrapper}>
                <Svg height="110" width="110" viewBox="0 0 200 200">
                  <Circle cx="100" cy="100" r="95" fill="#FFF" stroke="#E2E8F0" strokeWidth="4" />
                  {peopleData.map((person, index) => (
                    <Path key={person.id} d={createSectorPath(index, peopleData.length, 90)} fill={person.color} stroke="#FFF" strokeWidth="2" />
                  ))}
                  <Circle cx="100" cy="100" r="18" fill="#1E293B" />
                </Svg>
              </View>
              <Text style={styles.arrowIcon}>→</Text>
            </TouchableOpacity>

            {/* 카드 2: 하단 선택 카드 */}
            <TouchableOpacity 
              style={styles.pastelCardWhite} 
              onPress={() => setCurrentScreen('selector')}
            >
              <View style={styles.cardLeftContent}>
                <View style={styles.badgePillGray}><Text style={styles.badgePillGrayText}>02 / YOUR CHOICE</Text></View>
                <Text style={styles.pastelCardTitle}>선택</Text>
                <Text style={styles.pastelCardDesc}>함께 갈 사람을{"\n"}직접 고라주세요.</Text>
              </View>

              <View style={styles.miniCarWrapper}>
                <Text style={{fontSize: 28}}>🚗</Text>
              </View>
              <Text style={styles.arrowIcon}>→</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= 룰렛 실행 화면 ================= */}
        {currentScreen === 'roulette' && (
          <View style={styles.content}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionBadge}>RANDOM PICK</Text>
              <Text style={styles.sectionTitle}>오늘의 운전자는?</Text>
              <Text style={styles.sectionDesc}>네온 불꽃 테두리와 함께 공정하게 추첨합니다!</Text>
            </View>

            <View style={styles.rouletteWrapper}>
              <View style={styles.roulettePointer} />

              <View style={styles.neonGlowBox}>
                <Animated.View style={{ transform: [{ rotate: spinInterpolate }] }}>
                  <Svg height="260" width="260" viewBox="0 0 200 200">
                    <Circle cx="100" cy="100" r="98" fill="#0F172A" stroke="#38BDF8" strokeWidth="3" />
                    
                    {peopleData.map((person, index) => {
                      const total = peopleData.length;
                      const angle = 360 / total;
                      const midAngle = index * angle + angle / 2;
                      const rad = (midAngle - 90) * (Math.PI / 180);
                      const textRadius = 55;
                      const textX = 100 + textRadius * Math.cos(rad);
                      const textY = 100 + textRadius * Math.sin(rad);

                      return (
                        <G key={person.id}>
                          <Path d={createSectorPath(index, total, 92)} fill={person.color} stroke="#0F172A" strokeWidth="1.5" />
                          <SvgText 
                            x={textX} 
                            y={textY} 
                            fill="#0F172A" 
                            fontSize="13" 
                            fontWeight="900" 
                            textAnchor="middle" 
                            alignmentBaseline="central"
                            transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                          >
                            {person.name}
                          </SvgText>
                        </G>
                      );
                    })}
                  </Svg>
                </Animated.View>

                <View style={styles.wheelCenterPin}>
                  <Text style={styles.wheelCenterPinText}>START</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.primaryButton, isSpinning && { backgroundColor: '#9CA3AF' }]} 
              onPress={runRoulette}
              disabled={isSpinning}
            >
              <Text style={styles.primaryButtonText}>{isSpinning ? "룰렛 돌아가는 중..." : "⚡ 룰렛 돌리기!"}</Text>
            </TouchableOpacity>

            {rouletteWinner && !isSpinning && (
              <View style={styles.winnerCard}>
                <Text style={styles.winnerSub}>오늘의 행운의 드라이버</Text>
                <Text style={styles.winnerTitle}>{rouletteWinner.name} 님 당첨! 🎉</Text>
                <Text style={styles.winnerDetail}>{rouletteWinner.fuelType} · 연비 {rouletteWinner.efficiency} km/L</Text>
                <TouchableOpacity 
                  style={styles.proceedBtn}
                  onPress={() => {
                    setSelectedPerson(rouletteWinner);
                    setCurrentScreen('calculator');
                  }}
                >
                  <Text style={styles.proceedBtnText}>{rouletteWinner.name} 차량으로 기름값 계산하기 →</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* ================= 사람 선택 화면 ================= */}
        {currentScreen === 'selector' && (
          <View style={styles.content}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionBadge}>YOUR CHOICE</Text>
              <Text style={styles.sectionTitle}>누구의 차량으로 이동하나요?</Text>
              <Text style={styles.sectionDesc}>인물을 선택하면 해당 차량의 연비와 유종 데이터가 자동 적용됩니다.</Text>
            </View>

            <View style={styles.personListContainer}>
              {peopleData.map((person) => (
                <TouchableOpacity 
                  key={person.id} 
                  style={styles.personSelectCard}
                  onPress={() => {
                    setSelectedPerson(person);
                    setCurrentScreen('calculator');
                  }}
                >
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={[styles.colorDot, { backgroundColor: person.color }]} />
                    <View>
                      <Text style={styles.personCardName}>{person.name}</Text>
                      <Text style={styles.personCardRole}>{person.role} · {person.fuelType}</Text>
                    </View>
                  </View>
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.personCardEff}>{person.efficiency} km/L</Text>
                    <Text style={styles.personCardArrow}>선택하기 →</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ================= 유류비 계산 화면 ================= */}
        {currentScreen === 'calculator' && (
          <View style={styles.content}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionBadge}>TRIP CALCULATOR</Text>
              <Text style={styles.sectionTitle}>유류비 정산하기</Text>
              {selectedPerson && (
                <View style={styles.selectedBadgeBox}>
                  <Text style={styles.selectedBadgeText}>🚗 선택된 차량: {selectedPerson.name} ({selectedPerson.fuelType} / {selectedPerson.efficiency}km/L)</Text>
                </View>
              )}
            </View>

            <View style={styles.calcFormCard}>
              <Text style={styles.inputGroupTitle}>01 이동 거리 입력</Text>
              <Text style={styles.inputLabel}>편도 이동 거리 (km)</Text>
              <TextInput 
                style={styles.textInput}
                placeholder="예: 120"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={distance}
                onChangeText={setDistance}
              />

              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>왕복 여부 체크 (거리·통행료 2배)</Text>
                <TouchableOpacity 
                  style={[styles.switchBox, isRoundTrip && styles.switchBoxActive]}
                  onPress={() => setIsRoundTrip(!isRoundTrip)}
                >
                  <Text style={styles.switchText}>{isRoundTrip ? "ON" : "OFF"}</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.inputGroupTitle, {marginTop: 20}]}>02 주유 가격 입력</Text>
              <Text style={styles.inputLabel}>현재 리터당 유가 (원/L)</Text>
              <TextInput 
                style={styles.textInput}
                placeholder="예: 1650"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={fuelPrice}
                onChangeText={setFuelPrice}
              />

              <Text style={[styles.inputGroupTitle, {marginTop: 20}]}>03 고속도로 통행료 (선택)</Text>
              <Text style={styles.inputLabel}>편도 통행료 (원)</Text>
              <TextInput 
                style={styles.textInput}
                placeholder="없으면 비워두거나 0 입력"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={tollFee}
                onChangeText={setTollFee}
              />

              <TouchableOpacity style={styles.primaryButton} onPress={calculateOilCost}>
                <Text style={styles.primaryButtonText}>💰 예상 유류비 최종 계산하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>

      {/* ================= 결과 상세 팝업 모달 ================= */}
      <Modal visible={resultModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.resultModalContent}>
            {calculationResult && (
              <>
                <View style={styles.resultModalHeader}>
                  <Text style={styles.resultModalSub}>{calculationResult.person} 차량 · {calculationResult.tripType}</Text>
                  <TouchableOpacity onPress={() => setResultModalVisible(false)}>
                    <Text style={styles.closeModalText}>✕</Text>
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.resultModalMainTitle}>{calculationResult.totalCost}</Text>
                <Text style={styles.resultModalMainDesc}>연비와 통행료가 모두 반영된 최종 예상 정산 금액입니다.</Text>

                <View style={styles.resultDetailBox}>
                  <View style={styles.resultRow}><Text style={styles.resultKey}>총 이동 거리</Text><Text style={styles.resultVal}>{calculationResult.distance} km</Text></View>
                  <View style={styles.resultRow}><Text style={styles.resultKey}>예상 소모 유류량</Text><Text style={styles.resultVal}>{calculationResult.fuelUsed} L</Text></View>
                  <View style={styles.resultRow}><Text style={styles.resultKey}>순수 기름값</Text><Text style={styles.resultVal}>{calculationResult.fuelCostOnly}</Text></View>
                  <View style={styles.resultRow}><Text style={styles.resultKey}>통행료 총합</Text><Text style={styles.resultVal}>{calculationResult.toll}</Text></View>
                </View>

                <TouchableOpacity style={styles.primaryButton} onPress={() => setResultModalVisible(false)}>
                  <Text style={styles.primaryButtonText}>확인 완료</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ================= 설명 팝업 모달 ================= */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.infoModalContent}>
            <Text style={styles.infoModalTitle}>📖 앱 이용 가이드</Text>
            <Text style={styles.infoModalDesc}>
              1. 룰렛: 네온 불꽃 이펙트와 함께 인원수에 맞춰 자동 분할되는 동적 룰렛입니다[cite: 6].{'\n'}
              2. 인물 선택: 고정 연비(황지민/김기현/유승현)를 기반으로 간편하게 선택합니다.{'\n'}
              3. 유류비 계산: 이동 거리와 유가를 입력해 정확한 비용을 산출합니다.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.primaryButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
}

// ==========================================
// [디자인 스타일시트 - 첨부 이미지 감성 반영]
// ==========================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F3EE' }, // 이미지의 차분한 아이보리/베이지 톤 배경
  scrollContainer: { flexGrow: 1, paddingBottom: 50 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 55, paddingBottom: 15 },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  brandCircleText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  appNameText: { fontSize: 15, fontWeight: '900', color: '#1E293B' },
  appSubText: { fontSize: 9, color: '#64748B', fontWeight: 'bold', letterSpacing: 1 },
  topRightGroup: { flexDirection: 'row', alignItems: 'center' },
  topMenuText: { fontSize: 11, fontWeight: '600', color: '#475569' },
  topDivider: { fontSize: 11, color: '#CBD5E1', marginHorizontal: 6 },
  
  content: { flex: 1, padding: 20 },
  heroSection: { marginTop: 10, marginBottom: 25 },
  heroTag: { fontSize: 11, fontWeight: 'bold', color: '#64748B', letterSpacing: 1, marginBottom: 8 },
  heroTitle: { fontSize: 32, fontWeight: '900', color: '#1E293B', lineHeight: 40, marginBottom: 10 },
  heroDesc: { fontSize: 14, color: '#475569', lineHeight: 20 },

  // 1번 룰렛 카드 (연두색 파스텔톤 + 미니 룰렛 일러스트)
  pastelCardGreen: { backgroundColor: '#D9F99D', borderRadius: 24, padding: 24, marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 6 },
  cardLeftContent: { flex: 1 },
  badgePill: { backgroundColor: '#FEF08A', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 10 },
  badgePillText: { fontSize: 9, fontWeight: 'bold', color: '#854D0E' },
  pastelCardTitle: { fontSize: 26, fontWeight: '900', color: '#1E293B', marginBottom: 4 },
  pastelCardDesc: { fontSize: 13, color: '#3F6212', lineHeight: 18, marginBottom: 15 },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  actionIcon: { fontSize: 14, color: '#1E293B', marginRight: 5, fontWeight: 'bold' },
  actionText: { fontSize: 12, fontWeight: 'bold', color: '#1E293B' },
  miniWheelWrapper: { width: 90, height: 90, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  arrowIcon: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', position: 'absolute', top: 20, right: 20 },

  // 2번 선택 카드 (흰색 깔끔한 카드)
  pastelCardWhite: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, marginBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.03, shadowRadius: 4 },
  badgePillGray: { backgroundColor: '#F1F5F9', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 10 },
  badgePillGrayText: { fontSize: 9, fontWeight: 'bold', color: '#475569' },
  miniCarWrapper: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 10, borderWidth: 1, borderColor: '#E2E8F0' },

  sectionHeader: { marginBottom: 20, marginTop: 10 },
  sectionBadge: { fontSize: 11, fontWeight: 'bold', color: '#3B82F6', letterSpacing: 1, marginBottom: 4 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#0F172A', marginBottom: 6 },
  sectionDesc: { fontSize: 13, color: '#64748B' },
  
  rouletteWrapper: { alignItems: 'center', justifyContent: 'center', marginVertical: 20, position: 'relative' },
  roulettePointer: { 
    width: 0, 
    height: 0, 
    backgroundColor: 'transparent', 
    borderStyle: 'solid', 
    borderLeftWidth: 12, 
    borderRightWidth: 12, 
    borderTopWidth: 22, 
    borderLeftColor: 'transparent', 
    borderRightColor: 'transparent', 
    borderTopColor: '#EF4444', 
    zIndex: 10, 
    marginBottom: 5 
  },
  neonGlowBox: { 
    padding: 6, 
    borderRadius: 145, 
    backgroundColor: '#0F172A', 
    shadowColor: '#38BDF8', 
    shadowOffset: {width: 0, height: 0}, 
    shadowOpacity: 0.9, 
    shadowRadius: 16, 
    elevation: 12, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  wheelCenterPin: { position: 'absolute', width: 44, height: 44, borderRadius: 22, backgroundColor: '#1E293B', borderWidth: 3, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center', zIndex: 5 },
  wheelCenterPinText: { fontSize: 8, fontWeight: 'bold', color: '#FFF' },

  primaryButton: { backgroundColor: '#2563EB', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 15, shadowColor: '#2563EB', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.2, shadowRadius: 6 },
  primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  winnerCard: { backgroundColor: '#EFF6FF', borderRadius: 16, padding: 20, marginTop: 20, borderWidth: 1, borderColor: '#BFDBFE', alignItems: 'center' },
  winnerSub: { fontSize: 12, color: '#1E40AF', marginBottom: 4, fontWeight: 'bold' },
  winnerTitle: { fontSize: 22, fontWeight: '900', color: '#1E3A8A', marginBottom: 4 },
  winnerDetail: { fontSize: 13, color: '#475569', marginBottom: 15 },
  proceedBtn: { backgroundColor: '#2563EB', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  proceedBtnText: { fontSize: 13, fontWeight: 'bold', color: '#FFF' },
  personListContainer: { marginTop: 10 },
  personSelectCard: { backgroundColor: '#FFF', borderRadius: 14, padding: 18, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  colorDot: { width: 14, height: 14, borderRadius: 7, marginRight: 12 },
  personCardName: { fontSize: 17, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  personCardRole: { fontSize: 12, color: '#64748B' },
  personCardEff: { fontSize: 14, fontWeight: 'bold', color: '#2563EB', marginBottom: 4 },
  personCardArrow: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  selectedBadgeBox: { backgroundColor: '#EFF6FF', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, marginTop: 10, borderWidth: 1, borderColor: '#BFDBFE' },
  selectedBadgeText: { fontSize: 13, fontWeight: 'bold', color: '#1E40AF' },
  calcFormCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  inputGroupTitle: { fontSize: 14, fontWeight: 'bold', color: '#0F172A', marginBottom: 8 },
  inputLabel: { fontSize: 12, color: '#64748B', marginBottom: 6 },
  textInput: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, backgroundColor: '#F8FAFC', color: '#0F172A' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#CBD5E1' },
  toggleLabel: { fontSize: 13, fontWeight: 'bold', color: '#334155' },
  switchBox: { backgroundColor: '#CBD5E1', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6 },
  switchBoxActive: { backgroundColor: '#2563EB' },
  switchText: { fontSize: 12, fontWeight: 'bold', color: '#FFF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  resultModalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  resultModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  resultModalSub: { fontSize: 13, fontWeight: 'bold', color: '#64748B' },
  closeModalText: { fontSize: 18, fontWeight: 'bold', color: '#94A3B8' },
  resultModalMainTitle: { fontSize: 32, fontWeight: '900', color: '#0F172A', marginBottom: 4 },
  resultModalMainDesc: { fontSize: 13, color: '#64748B', marginBottom: 20 },
  resultDetailBox: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 15 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  resultKey: { fontSize: 13, color: '#64748B' },
  resultVal: { fontSize: 13, fontWeight: 'bold', color: '#0F172A' },
  infoModalContent: { backgroundColor: '#FFF', borderRadius: 20, padding: 24, width: '85%', alignSelf: 'center', marginBottom: 'auto', marginTop: 'auto' },
  infoModalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 12 },
  infoModalDesc: { fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 20 }
});