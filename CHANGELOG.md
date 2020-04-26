# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- add link to feedback form (
  [#105](https://github.com/wizard-online/wizard-online/pull/105)
)
- integrate google analytics (
  [#114](https://github.com/wizard-online/wizard-online/pull/114)
)

Further:
  [#115](https://github.com/wizard-online/wizard-online/pull/115),

## [1.0.0-alpha.2] - 2020-04-23

### Added
- scenario test (
  [#85](https://github.com/wizard-online/wizard-online/pull/85)
  )
- game notifications (
  [#95](https://github.com/wizard-online/wizard-online/pull/95)
  )
- custom lobby (
  [#98](https://github.com/wizard-online/wizard-online/pull/98)
  )
- highlight who's turn it is (
  [#89](https://github.com/wizard-online/wizard-online/pull/89)
  )

### Changed
- improve bidding slider (
  [#82](https://github.com/wizard-online/wizard-online/pull/82),
  [#93](https://github.com/wizard-online/wizard-online/pull/93)
  )
- improve card colors (
  [#92](https://github.com/wizard-online/wizard-online/pull/92)
  )

### Fixed

- the new trick leader is not influenced by the previous trick's lead suit when picking a lead card (
  [#80](https://github.com/wizard-online/wizard-online/pull/80)
)
- do not call onClickCard callback function if a clicked card is not interactive (
  [#81](https://github.com/wizard-online/wizard-online/pull/81)
)
- prevent random dealer selection if previous dealer had id 0 (=falsy) (
  [#83](https://github.com/wizard-online/wizard-online/pull/83)
)
- fix: N can win tricks (
  [#86](https://github.com/wizard-online/wizard-online/pull/86)
)
- error on gameover (
  [#88](https://github.com/wizard-online/wizard-online/pull/88),
)
- restore back to lobby button (
  [#100](https://github.com/wizard-online/wizard-online/pull/100)
)

Further:
  [#87](https://github.com/wizard-online/wizard-online/pull/87),
  [#90](https://github.com/wizard-online/wizard-online/pull/90),
  [#91](https://github.com/wizard-online/wizard-online/pull/91),
  [#96](https://github.com/wizard-online/wizard-online/pull/96),
  [#99](https://github.com/wizard-online/wizard-online/pull/99),
  [#101](https://github.com/wizard-online/wizard-online/pull/101)
 

## [1.0.0-alpha.1] - 2020-04-06

### Added
- show player names (
  [#57](https://github.com/wizard-online/wizard-online/pull/57)
  )
- show player names on trick cards (
  [#59](https://github.com/wizard-online/wizard-online/pull/59)
  )
- highlight trick-winning card (
  [#61](https://github.com/wizard-online/wizard-online/pull/61)
  )

### Changed
- keep complete trick on the table until next move (
  [#58](https://github.com/wizard-online/wizard-online/pull/58)
  )


### Fixed:
- no trump selection in final round (
  [#55](https://github.com/wizard-online/wizard-online/pull/55),
)
- wring trick winner when lead card is N (
  [#56](https://github.com/wizard-online/wizard-online/pull/56)
)

Further: 
  [#60](https://github.com/wizard-online/wizard-online/pull/60),
  [#65](https://github.com/wizard-online/wizard-online/pull/65),
deployment & error tracking (
  [#62](https://github.com/wizard-online/wizard-online/pull/62),
  [#64](https://github.com/wizard-online/wizard-online/pull/64),
  [#66](https://github.com/wizard-online/wizard-online/pull/66),
  [#67](https://github.com/wizard-online/wizard-online/pull/67),
  [#68](https://github.com/wizard-online/wizard-online/pull/68),
  [#69](https://github.com/wizard-online/wizard-online/pull/69),
  [#70](https://github.com/wizard-online/wizard-online/pull/70),
  )

## 1.0.0-alpha.0 - 2020-04-02
**(initial release)**

### Added
- create gameboard (
  [#2](https://github.com/wizard-online/wizard-online/pull/2)
  )
- setup autoformat and linter (
  [#3](https://github.com/wizard-online/wizard-online/pull/3),
  [#9](https://github.com/wizard-online/wizard-online/pull/9),
  [#10](https://github.com/wizard-online/wizard-online/pull/10)
  )
- add score pad (
  [#8](https://github.com/wizard-online/wizard-online/pull/8)
  )
- handle end of game (
  [#14](https://github.com/wizard-online/wizard-online/pull/14)
  )
- add card sorting feature (
  [#15](https://github.com/wizard-online/wizard-online/pull/15)
  )
- setup server (
  [#5](https://github.com/wizard-online/wizard-online/pull/5),
  [#24](https://github.com/wizard-online/wizard-online/pull/24),
  [#34](https://github.com/wizard-online/wizard-online/pull/34)
  )
- add trump selecting phase (
  [#16](https://github.com/wizard-online/wizard-online/pull/16)
  )
- design player view (
  [#20](https://github.com/wizard-online/wizard-online/pull/20),
  [#28](https://github.com/wizard-online/wizard-online/pull/28)
  )

### Fixed
  [#18](https://github.com/wizard-online/wizard-online/pull/18),
  [#35](https://github.com/wizard-online/wizard-online/pull/35)

Further:
  [#11](https://github.com/wizard-online/wizard-online/pull/11),
  [#19](https://github.com/wizard-online/wizard-online/pull/19),
  [#29](https://github.com/wizard-online/wizard-online/pull/29),
  [#30](https://github.com/wizard-online/wizard-online/pull/30),
  [#33](https://github.com/wizard-online/wizard-online/pull/33)
