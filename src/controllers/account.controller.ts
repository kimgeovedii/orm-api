import { Account } from "./../generated/prisma/client";
import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const filteredData: Partial<Account> = {};
    const limit = Number(req.query.limit) || 2;
    const page = Number(req.query.page) || 1;

    if (req.query.name) {
      filteredData.name = req.query.name as string;
    }
    if (req.query.email) {
      filteredData.email = req.query.email as string;
    }

    //access prisma model with function
    const accounts = await prisma.account.findMany({
      where: filteredData,
      omit: {
        updateddAt: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    //send data result
    res.status(200).send({
      status: "success",
      message: "successfully create new account",
      data: accounts,
      meta: {
        perPage: limit,
        page: page,
        totalPage: page,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
export const getAverageAge = async (req: Request, res: Response) => {
  try {
    //access prisma model with function
    const ageAvg = await prisma.account.aggregate({
      _avg: {
        age: true,
      },
      _max: {
        age: true,
      },
    });
    //send data result
    res.status(200).send({
      status: "success",
      message: "successfully get Average Age account",
      data: ageAvg,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const createAccount = async (req: Request, res: Response) => {
  try {
    const create = await prisma.account.create({
      data: req.body,
    });

    res.status(200).send({
      status: "success",
      message: "successfully create new account",
      data: create,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const updateAccount = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (id) {
      const update = await prisma.account.update({
        where: { id: parseInt(id as string) },
        data: req.body,
      });
    }

    res.status(200).send({
      status: "success",
      message: "successfully update account",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (id) {
      await prisma.account.delete({
        where: { id: parseInt(id as string) },
      });
    }

    res.status(200).send({
      status: true,
      message: "successfully delete account",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
