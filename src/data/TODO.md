- implement diff cache strategy, we might not always want to ajax pull again everything everytime
- implement error case and RenderError

ADVANCED
- implement a more complex system that would load missing data. Exemple: if someone else creates a new account and an operation on it, we don't refresh our page but we just load something like that Operation view page, we need to be able to load missing linked account. We can take server's data, compare it with the schema, and if we have missing ids, we do cascading of API calls until everything is loaded...
