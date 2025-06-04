# Implementing New Betting Categories

This frontend update adds support for several extra betting categories:

- `mostDeaths` – wager on the player that will die the most.
- `fewestKills` – wager on the player that will secure the fewest kills.
- `firstBlood` – who will claim the very first kill of the match.
- `mostDamageTaken` – which player will soak up the most damage.
- `highestVision` – who will end with the highest vision score.

To integrate these on the backend:

1. **Extend the bet validation logic** so that `category` accepts the new values above in addition to the previous ones (`mostKills`, `fewestDeaths`, `mostAssists`, `mostDamage`).
2. **Include the new categories when calculating odds**. Odds are requested from `/odds/:sessionId` and should contain entries for all of the categories listed above mapping each player id to a numeric odd.
3. **Resolve bets** by comparing end-of-match statistics. For example use the timeline data to determine `firstBlood`, aggregate `damageTaken` for `mostDamageTaken`, and vision score for `highestVision`.
4. Emit the same socket events as for the other categories when a bet is resolved so the UI updates automatically.

With these server side changes the frontend will display and handle bets for the new categories.
