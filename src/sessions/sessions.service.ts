import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionsRepository: Repository<SessionEntity>,
  ) {}

  // ---------- Create ---------- //

  create(data: DeepPartial<SessionEntity>) {
    const now = new Date();
    now.setDate(now.getDate() + 30);
    data.expiresIn = new Date(now);
    return this.sessionsRepository.save(data);
  }

  // ---------- Find one by Id ---------- //

  async findOne(id: SessionEntity['id']) {
    const session = await this.sessionsRepository.findOne({ where: { id } });
    if (!session)
      throw new NotFoundException(`Session with id ${id} not found`);
    return session;
  }

  // ---------- Find One by Hash ---------- //

  async findOneByHash(hash: SessionEntity['hash']) {
    const session = await this.sessionsRepository.findOne({ where: { hash } });
    if (!session)
      throw new NotFoundException(`Session with hash ${hash} not found`);
    return session;
  }

  // ---------- Find One by User ---------- //

  async findOneByUser(userId: number) {
    const session = await this.sessionsRepository.findOne({
      where: { user: { id: userId } },
    });
    return session;
  }

  // ---------- Find all Session ---------- //

  findAll() {
    return this.sessionsRepository.find();
  }

  // ---------- Update Session ---------- //

  async updateSessionHash(
    id: SessionEntity['id'],
    hash: SessionEntity['hash'],
  ) {
    const now = new Date();
    now.setDate(now.getDate() + 30);
    const newExpiresIn = new Date(now);
    await this.sessionsRepository.update(id, {
      hash,
      expiresIn: newExpiresIn,
    });
  }

  async remove(id: SessionEntity['id']) {
    const session = await this.findOne(id);

    if (session) await this.sessionsRepository.delete(session.id);
  }
}
