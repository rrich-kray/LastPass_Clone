import Entity from "../Types/Entity.ts"

class EntityLevenshteinScore<T> {
    entity: T;
    score: number;

    constructor(entity: T, score: number) {
        this.entity = entity;
        this.score = score;
    }
}

class FuzzyMatchService {
    private static LevenshteinDistance(first: string, second: string): number {
        if (first.length === 0) return second.length;
        if (second.length === 0) return first.length;

        const d: number[][] = Array.from({ length: first.length + 1 }, () => Array(second.length + 1).fill(0));

        for (let i = 0; i <= first.length; i++) {
            d[i][0] = i;
        }
        for (let j = 0; j <= second.length; j++) {
            d[0][j] = j;
        }

        for (let i = 1; i <= first.length; i++) {
            for (let j = 1; j <= second.length; j++) {
                const cost = (second[j - 1] === first[i - 1]) ? 0 : 1;
                d[i][j] = this.Min(
                    d[i - 1][j] + 1,
                    d[i][j - 1] + 1,
                    d[i - 1][j - 1] + cost
                );
            }
        }
        return d[first.length][second.length];
    }

    private static NormalizeScores<T>(scores: EntityLevenshteinScore<T>[]): EntityLevenshteinScore<T>[] {
        const max = Math.max(...scores.map(x => x.score));
        const min = Math.min(...scores.map(x => x.score));

        console.log(`Max: ${max}`);
        return scores.map(score => {
            const normalizedScore = (score.score - min) / (max - min);
            console.log(`Normalized score: ${normalizedScore}`);
            return new EntityLevenshteinScore(score.entity, normalizedScore);
        });
    }


    public static ProduceFuzzyMatchRanking<T extends Entity>(entities: T[], search: string): T[] {
        const scores: EntityLevenshteinScore<T>[] = entities.map(entity => {
            const entityCopy: { [key: string]: string | number } = entity;
            const distances: number[] = [];
            const properties = Object.keys(entityCopy);
            for (const property of properties) {
                const propertyValue = entityCopy[property];
                if (typeof propertyValue === 'string') {
                    distances.push(this.LevenshteinDistance(propertyValue, search));
                }
            }
            return new EntityLevenshteinScore(entity, Math.min(...distances));
        });

        return this.NormalizeScores(scores)
            .filter(score => score.score < 0.25)
            .map(score => score.entity);
    }

    public static SimpleMatchingAlgorithm<T extends Entity>(entities: T[], search: string | undefined): T[] {
        if (search === undefined || (search.length === 0)) return entities;
        return entities.filter(entity => {
            const name = entity.name;
            if (name !== undefined && name.length !== 0) {
                return name.toLowerCase().startsWith(search.toLowerCase());
            } else return false;
        });
    }

    private static Min(e1: number, e2: number, e3: number): number {
        return Math.min(Math.min(e1, e2), e3);
    }
}

export default FuzzyMatchService;