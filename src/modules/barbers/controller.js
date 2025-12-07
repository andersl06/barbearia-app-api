// src/modules/barbers/controller.js
import * as service from "./service.js";

export async function create(req, res, next) {
  try {
    const barbershopId = Number(req.params.barbershopId);
    const payload = req.body; // Renomeado para 'payload' para clareza e consistência

    // Validação de campos obrigatórios, INCLUINDO A SENHA
    const user = payload.user;
    if (!user || !user.name || !user.email || !user.phone || !user.cpf || !user.gender || !user.password) {
      return res.status(400).json({ message: "Todos os campos obrigatórios do usuário, incluindo a senha, devem ser fornecidos." });
    }

    const result = await service.create(barbershopId, payload);
    // Usar 201 Created para criação bem-sucedida
    res.status(201).json(result); 
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const barbershopId = Number(req.params.barbershopId);
    const result = await service.list(barbershopId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function patch(req, res, next) {
  try {
    const barbershopId = Number(req.params.barbershopId);
    const userId = Number(req.params.userId);
    const updates = req.body;

    const result = await service.patch(barbershopId, userId, updates);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function linkOwner(req, res, next) {
  try {
    const barbershopId = Number(req.params.barbershopId);
    const ownerUser = req.user; // veio do authMiddleware
    const payload = req.body || {};

    const result = await service.linkOwnerAsBarber(
      barbershopId,
      ownerUser.id,
      payload
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
}
