import random


def pc_guess_number(x):

    print("\nXXXXXXXXXXXXXXXXXXXXXXXX")
    print("XXX Welcome stranger XXX")
    print("XXXXXXXXXXXXXXXXXXXXXXXX")
    print(f"XXX Choose a number between 1 y {x} I will guess it XXX\n")

    limit_low = 1
    limit_top = x

    respons = ""
    while respons != "c":
        if limit_low != limit_top:
            guess = random.randint(limit_low, limit_top)
        else:
            guess = limit_low

        respons = input(f"I guess the number is {guess}.\nIf it is too high press (A).\nIf it is too low press (B).\nIf I guess press (C):\n").lower()

        if respons == "a":
            limit_top = guess - 1
        elif respons == "b":
            limit_low = guess + 1

    print(f"\n¡¡¡¡I guess it correctly, you own me {guess} Million berries!!!!")


pc_guess_number(10)