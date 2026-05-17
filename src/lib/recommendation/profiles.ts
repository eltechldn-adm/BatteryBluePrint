import { HomeownerProfile, Archetype } from "./types";

export function determineArchetype(profile: HomeownerProfile): Archetype {
    let scoreBackup = 0;
    let scoreRoi = 0;
    let scoreDiy = 0;
    let scoreSmart = 0;

    if (profile.outageFrequency === 'Weekly' || profile.backupGoal === 'Whole-Home') scoreBackup += 2;
    if (profile.budgetSensitivity === 'Strict') scoreRoi += 2;
    if (profile.installerPreference === 'DIY') scoreDiy += 3;
    if (profile.utilityTariff === 'Dynamic/Agile') scoreSmart += 2;

    const max = Math.max(scoreBackup, scoreRoi, scoreDiy, scoreSmart);

    if (max === 0) return 'Balanced';
    if (scoreDiy === max) return 'DIY Builder';
    if (scoreBackup === max) return 'Backup Security';
    if (scoreSmart === max) return 'Smart Tariff Maximizer';
    if (scoreRoi === max) return 'ROI Optimizer';

    return 'Balanced';
}
