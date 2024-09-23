using PasswordManager.Server.Data.Entities;
using System.Collections.Generic;
using System.Net.Sockets;

namespace PasswordManager.Server.Services
{
    public class FuzzyMatchService
    {
        private class EntityLevenshteinScore<T>
        {
            public T Entity { get; set; }
            public int Score { get; set; }
        }
        public static IEnumerable<T> ProduceFuzzyMatchRanking<T>(IEnumerable<T> entities, string search)
        {
            IEnumerable<EntityLevenshteinScore<T>> scores = entities.Select(entity =>
            {
                var distances = new List<int>();
                foreach (var property in entity.GetType().GetProperties())
                {
                    var propertyValue = property.GetValue(entity)?.ToString();
                    if (property.PropertyType == typeof(string) && propertyValue != null)
                        distances.Add(FuzzyMatchService.LevenshteinDistance(propertyValue, search));
                }
                return new EntityLevenshteinScore<T>
                {
                    Entity = entity,
                    Score = distances.Min(distance => distance)
                };
            });

            return FuzzyMatchService
                .NormalizeScores<T>(scores)
                .TakeWhile(score => score.Score < .25)
                .Select(x => x.Entity);
        }
        public IEnumerable<T> SimpleMatchingAlgorithm<T>(IEnumerable<T> entities, string search) 
        {
            return entities.Where(entity => entity.GetType().GetProperty("Name")?.GetValue(entity).ToString().StartsWith(search) ?? false);
        }
        private static IEnumerable<EntityLevenshteinScore<T>> NormalizeScores<T>(IEnumerable<EntityLevenshteinScore<T>> scores) // returning 1 every time
        {
            var max = scores.Max(x => x.Score);
            var min = scores.Min(x => x.Score);
            System.Diagnostics.Debug.WriteLine($"Max: {max}");
            return scores.Select(score => {
                System.Diagnostics.Debug.WriteLine($"Normalized score: {((score.Score - min) / (max - min))}");
                return new EntityLevenshteinScore<T>
                {
                    Entity = score.Entity,
                    Score = ((score.Score - min) / (max - min))
                };
            });
        }
        private static int LevenshteinDistance(string first, string second)
        {
            if (first.Length == 0)
            {
                return second.Length;
            }

            if (second.Length == 0)
            {
                return first.Length;
            }

            var d = new int[first.Length + 1, second.Length + 1];
            for (var i = 0; i <= first.Length; i++)
            {
                d[i, 0] = i;
            }

            for (var j = 0; j <= second.Length; j++)
            {
                d[0, j] = j;
            }

            for (var i = 1; i <= first.Length; i++)
            {
                for (var j = 1; j <= second.Length; j++)
                {
                    var cost = (second[j - 1] == first[i - 1]) ? 0 : 1;
                    d[i, j] = Min(
                         d[i - 1, j] + 1,
                         d[i, j - 1] + 1,
                         d[i - 1, j - 1] + cost
                    );
                }
            }
            return d[first.Length, second.Length];
        }
        private static int Min(int e1, int e2, int e3) => Math.Min(Math.Min(e1, e2), e3);
    }
}
