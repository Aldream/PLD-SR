#include <stdio.h>
#include <stdlib.h>

#include "gThreads.h"
#include "gSem.h"

semaphore *sem;

void idle(void *args)
{
	while(1);
}

void letters(void *args)
{
	int i;
	for (i = 0; i<11; i++)
	{
		puts("A");
		puts("B");
		puts("C");
	}
	/*semGive(sem);*/
}

void numbers(void *args)
{
	int i;
	/*semTake(sem);*/
	for (i = 0; i<15 ; i++)
	/*while(1)*/
	{
		puts("1");
		puts("2");
	}
}


void others(void *args)
{
	int i;
	for (i = 0; i<13; ++i) 
	{
		puts("+");
		puts("-");
		puts("*");
		puts("/");
	}
}

int main()
{
	/*
	 * Create two threads
	 */
	createGThread("numbers", numbers, NULL, STACK_SIZE);
	createGThread("letters", letters, NULL, STACK_SIZE);
	createGThread("others", others, NULL, STACK_SIZE);
	createGThread("idleThread", idle, NULL, STACK_SIZE);
	/*createGThread("others", others, NULL, STACK_SIZE);*/
		
	/* To be sure they are all welle created */
	listThreads();
	
	sem = malloc(sizeof(semaphore));
	semInit(sem,0);
	
	/* Scheduler call */
	startSched();
	
	/*
	killGThread(numbersId);
	killGThread(lettersId);
	*/
	
	printf("Exit application\n");
	return 0;
}