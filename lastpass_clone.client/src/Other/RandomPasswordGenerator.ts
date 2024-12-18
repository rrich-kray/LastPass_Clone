class RandomPasswordGenerator
{
    constructor() { }

    public GeneratePassword()
    {
        let password: string = "";
        for (let i = 0; i <= 50; i++)
        {
            password += String.fromCharCode(Math.floor(Math.random() * (128-0) + 0));
        }
        return password;
    }
}

export default RandomPasswordGenerator;