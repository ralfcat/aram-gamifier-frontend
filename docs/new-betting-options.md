# Implementing New Betting Categories

This frontend update adds support for two extra betting categories:

- `mostDeaths` – wager on the player that will die the most.
- `fewestKills` – wager on the player that will secure the fewest kills.

To integrate these on the backend:

1. **Extend the bet validation logic** so that `category` accepts the new values above in addition to the previous ones (`mostKills`, `fewestDeaths`, `mostAssists`, `mostDamage`).
2. **Include the new categories when calculating odds**.  Odds are requested from `/odds/:sessionId` and should contain an entry for `mostDeaths` and `fewestKills` mapping each player id to a numeric odd.
3. **Resolve bets** by comparing end-of-match statistics. Use total deaths to decide the `mostDeaths` winner and total kills for `fewestKills`.
4. Emit the same socket events as for the other categories when a bet is resolved so the UI updates automatically.

With these server side changes the frontend will display and handle bets for the new categories.
