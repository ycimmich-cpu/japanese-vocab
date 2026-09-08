# 일본어 단어장 — PWA 배포 파일

이 폴더의 파일 **전부**를 웹에 올리면 휴대폰에서 앱처럼 설치해 쓸 수 있습니다.

**배포 주소: https://ycimmich-cpu.github.io/japanese-vocab/**

## 파일 구성
| 파일 | 역할 |
|---|---|
| `index.html` | 앱 본체 (수업 단어 951개 내장) |
| `kanji.json` | 한자 획순 자료 2,325자 (상용한자 + 가나) — **KanjiVG** |
| `manifest.webmanifest` | 앱 이름·아이콘·화면 설정 (홈화면 설치 정보) |
| `sw.js` | 오프라인 캐시 담당 (service worker) |
| `icon-192.png` `icon-512.png` `icon-maskable-512.png` | 앱 아이콘 |
| `apple-touch-icon.png` | 아이폰 홈화면 아이콘 |
| `favicon-32.png` | 브라우저 탭 아이콘 |

> **중요**: 파일은 반드시 같은 폴더에 **평평하게** 두어야 합니다. 하위 폴더로 옮기면 서로를 못 찾습니다.

## 기능
- 날짜(수업 회차)별로 묶어 카드 학습 · 4지선다 퀴즈 (단어→뜻 / 뜻→단어 / 듣고 맞추기)
- 학습 상태 **よし**(알고 있어요) / **まだ**(더 학습할게요) 로 분류하고 범위를 골라 학습
- 예문 낭독, 한자 후리가나 루비
- **한자 획순 보기** — 학습 카드의 ✎ 버튼
- 문장 읽기(음독) — 지문을 등록하고 읽은 횟수를 기록
- 사진·PDF·워드에서 단어·지문 자동 등록 (본인 Claude API 키 사용, 기기에만 저장)

## 왜 웹에 올려야 하나요?
홈화면 설치와 오프라인 기능(service worker)은 브라우저 보안 정책상 **HTTPS 주소에서만** 동작합니다.
바탕화면의 HTML 파일을 더블클릭하는 `file://` 방식으로는 설치가 불가능합니다.
(PC에서 그냥 쓰실 때는 폴더의 `일본어단어장_PC_..._v2.9.html` 단독 파일을 쓰시면 됩니다.)

## GitHub Pages 배포 순서
1. GitHub에서 새 리포지토리 생성 (예: `japanese-vocab`) — **Public**
2. `Add file → Upload files`로 이 폴더의 **파일 전부**를 업로드 후 Commit
3. `Settings → Pages → Source: Deploy from a branch → main / (root)` 저장
4. 1~3분 뒤 `https://<계정명>.github.io/japanese-vocab/` 주소가 열립니다

## 휴대폰 설치
- **아이폰(사파리)**: 주소 접속 → 아래쪽 공유 버튼(⬆️) → **홈 화면에 추가**
- **안드로이드(크롬)**: 주소 접속 → 설정에 나타나는 **홈 화면에 추가** 버튼, 또는 메뉴 → 앱 설치

## 알아두실 점
- **PC와 휴대폰의 단어 데이터는 따로 저장됩니다.** 옮기실 때는 설정 → *전체 백업 내보내기* → 휴대폰에서 *백업 불러오기*
- 앱을 새 버전으로 올릴 때는 `sw.js`의 `CACHE` 값을 함께 올려야 이전 캐시가 정리되고 업데이트 알림이 뜹니다
- 아이폰 사파리는 화면을 처음 탭하기 전까지 소리를 막습니다. 발음이 안 들리면 화면을 한 번 탭한 뒤 🔊를 눌러 주세요
- API 키와 미처리 사진은 백업 파일에 들어가지 않습니다 (의도된 설계)

## 자료 출처와 라이선스

### 한자 획순 — KanjiVG
`kanji.json`의 획순 자료는 **[KanjiVG](http://kanjivg.tagaini.net)** 에서 가져와 이 앱이 쓰기 좋은 형태로
(획 경로만 남기고 좌표를 소수 첫째 자리로 줄여) 다시 정리한 것입니다.

> Copyright © 2009–2011 Ulrich Apel.
> This work is distributed under the conditions of the
> **Creative Commons Attribution-Share Alike 3.0** Licence.
> <https://creativecommons.org/licenses/by-sa/3.0/>

원자료와 마찬가지로 `kanji.json` 역시 **CC BY-SA 3.0** 조건으로 배포됩니다.
가져다 쓰실 때는 KanjiVG를 밝히고 같은 조건으로 공유해 주세요.

### 앱 코드와 수업 단어
앱 코드와 단어 카드(뜻·예문·팁)는 이 저장소 소유자의 개인 학습용 자료입니다.
