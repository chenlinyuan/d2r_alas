# NovaTune 新星精力范围

D2RMM 模组：让法师新星（Nova）的 AOE 范围随精力加成，并在技能说明里显示“范围”。

## 改动

1. `skills.txt` `Nova`：`calc1`（Missile Velocity Adder）改为
   `stat('Energy'.base)/X`（X 默认 50），精力越高，新星扩张越远。
2. `missiles.txt` `nova`：导弹 `Range` 从 13 抬高到 40，避免能量加成后被旧上限截断。
3. `skilldesc.txt` `nova`：新增一行“范围”，calc 为 `13 + stat('Energy'.base)/X`（帧/单位）。
4. `skills.json`：新增 `StrSkillRangeEnergy` 翻译 key（`Range: %d` / `范围：%d`）。

## 配置

- `energyPerRange`：每 X 点精力 +1 范围（默认 `50`）。无上限控制。

## 需实机验证（重要）

- 新星半径来自导弹 `Range` 与 `Vel/Accel`，`calc1`（速度加成）能否线性放大半径
  在 D2R 里不是干净公式。请测试：
  1. 基础新星半径是否变化（我把 `Range` 抬到 40，若基础变大说明旧 `Range=13` 是硬上限，
     我再回调；若不变则速度驱动，正常）。
  2. 每 50 精力是否大约 +1 范围。
  3. 技能面板是否显示“范围：X”。
  根据实测我再校准 `calc1` 常数/`Range`/显示公式。
