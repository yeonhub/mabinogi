"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { calculateCumulativeStats } from "@/utils/cumulativeBonusStats";
import useCurrentCategoryInfoStore from "@/store/CurrentCategoryInfo-store";

const initialStats = {
  ap: 0,
  hp: 0,
  mp: 0,
  sp: 0,
  str: 0,
  dex: 0,
  int: 0,
  will: 0,
  luck: 0,
  rp: 0,
};

export default function SelectRank({ skill }: { skill: SkillsTypes }) {
  const { calculateCurrentStats } = useCurrentCategoryInfoStore();
  const router = useRouter();

  const [rankByStats, setRankByStats] = useState(initialStats);

  // detail 버튼 클릭 함수
  const handleClickDetail = (talent: string, id: number) => {
    router.push(`/skill/${talent}/${id}`);
  };

  // 랭크 선택 함수
  const handleSelectRank = (value: string) => {
    const selectRankIndex = skill.skill_by_rank.findIndex(skill => skill.rank === value);

    // 누적 스탯 계산
    const cumulativeBonusStat = calculateCumulativeStats(skill, selectRankIndex);

    // ----------------------------------------------------------------

    // 누적 ap 계산
    const cumulativeAP =
      skill.skill_by_rank.slice(0, selectRankIndex + 1).reduce((acc, rankInfo) => {
        return acc + rankInfo.ap;
      }, 0) || 0;
    // ----------------------------------------------------------------

    const cumulativeRpArray =
      skill.skill_by_rank[selectRankIndex].rp.reduce((acc, rankInfo) => {
        console.log(rankInfo);
        return acc + rankInfo.exp;
      }, 0) || 0;

    console.log(cumulativeRpArray);
    // console.log(cumulativeRp);

    const newRankStats = {
      ...initialStats,
      ...cumulativeBonusStat,
      ap: cumulativeAP,
      // rp: cumulativeRp,
    };

    setRankByStats(newRankStats);
    calculateCurrentStats(newRankStats);
    console.log(newRankStats);
  };

  return (
    <>
      <TableCell>
        <Select onValueChange={value => handleSelectRank(value)}>
          <SelectTrigger>
            <SelectValue placeholder="연습" />
          </SelectTrigger>

          <SelectContent>
            {skill.skill_by_rank.map((item, index) => (
              <SelectItem key={index} value={item.rank}>
                {item.rank}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      <TableCell>
        {rankByStats.ap || 0}/{skill.skill_by_total.ap || 0}
      </TableCell>

      <TableCell>
        {rankByStats.hp || 0}/{skill.skill_by_total.hp || 0}
      </TableCell>

      <TableCell>
        {rankByStats.mp || 0}/{skill.skill_by_total.mp || 0}
      </TableCell>

      <TableCell>
        {rankByStats.sp || 0}/{skill.skill_by_total.sp || 0}
      </TableCell>

      <TableCell>
        {rankByStats.str || 0}/{skill.skill_by_total.str || 0}
      </TableCell>

      <TableCell>
        {rankByStats.dex || 0}/{skill.skill_by_total.dex || 0}
      </TableCell>

      <TableCell>
        {rankByStats.int || 0}/{skill.skill_by_total.int || 0}
      </TableCell>

      <TableCell>
        {rankByStats.will || 0}/{skill.skill_by_total.will || 0}
      </TableCell>

      <TableCell>
        {rankByStats.luck || 0}/{skill.skill_by_total.luck || 0}
      </TableCell>

      <TableCell>
        <Button onClick={() => handleClickDetail(skill.category, skill.skill_id)}>자세히</Button>
      </TableCell>
    </>
  );
}
