# ThunderStormTune 雷云风暴优化

D2RMM 模组：优化法师“雷云风暴”（Thunder Storm）技能，并在技能说明里显示攻击间隔。

## 改动

1. `skills.txt`：`Thunder Storm` 的 `Param3`（Periodic Damage Rate Min）改为 `0`；
   `Param5=0`、`Param6=100` 保持原版，保留 `dm56` 的等级缩放。
2. `skilldesc.txt`：新增一行“攻击间隔”，用真实公式计算并以帧显示：
   - `dm56 = (110*lvl*(par6-par5)) / (100*(lvl+6)) + par5`
   - `perdelay = (100 - dm56) * par4/100 + par3`
3. `skills.json`：新增两个翻译 key（id 90050/90051）：
   - `StrSkillAttackInterval`：`Attack Interval: %d frames` / `攻击间隔：%d 帧`
   - `StrSkillAttackIntervalSingular`：`Attack Interval: %d frame` / `攻击间隔：%d 帧`

## 关于 dm56

- `dm56` 随技能等级升高而增大，所以**等级越高落雷越快**。
- 技能面板显示当前等级下的真实间隔帧数（随等级变化）。
