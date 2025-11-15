import random

def guess_number(x):

    print("------------------")
    print("--- Bienvenidx ---")
    print("------------------")
    print("Debes adivinar el numero generado por el PC")

    random_number = random.randint(1,x)

    guess = 0

    while guess != random_number:
        guess = int(input(f"Adivina un numero entre 1 y {x}: "))

        if guess < random_number:
            print("Intenta de nuevo. Este numero es muy pequeño")
        elif guess > random_number:
            print("Intenta de nuevo. Este numero es muy grande")

    print(f"Felicidades, haz adivinado el numero {random_number}")


guess_number(10)