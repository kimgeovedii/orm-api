import { prisma } from "../config/prisma";
import { Account } from "../generated/prisma/client";
import { Request, Response } from "express";
import { hashPassword } from "../utils/hashpassword";
import { compare } from "bcrypt";

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const filterData: Partial<Account> = {};

    const limit = Number(req.query.limit) || 2;
    const page = Number(req.query.page) || 1;

    if (req.query.name) {
      filterData.name = req.query.name as string;
    }

    if (req.query.email) {
      filterData.email = req.query.email as string;
    }

    // access prisma model with function
    const accounts = await prisma.account.findMany({
      where: filterData,
      include: {
        address: {
          omit: {
            id: true,
            accountId: true,
          },
        },
      },
      omit: {
        updateddAt: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    // send data result

    res.status(200).send(accounts);
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
      data: { ...req.body, password: await hashPassword(req.body.password) },
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
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;
    const update = await prisma.account.update({
      where: {
        email,
      },
      data: { password: await hashPassword(newPassword) },
    });

    res.status(200).send({
      status: "success",
      message: "successfully reset password",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const account = await prisma.account.findUnique({
      where: {
        email,
      },
    });
    // 1. cek email
    if (!account) {
      return res.status(401).json({ message: "Email or password wrong" });
    }

    // 2. cek password
    const isValid = await compare(password, account.password as string);
    if (!isValid) {
      return res.status(401).json({ message: "Email or password wrong" });
    }
    res.status(201).send({
      status: true,
      message: "successfully Login",
      data: account,
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
