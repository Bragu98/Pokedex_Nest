import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon,  } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModule:Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name= createPokemonDto.name.toLocaleLowerCase();

    try {
      
      const pokemon = await this.pokemonModule.create(createPokemonDto)
      return pokemon;  

    } catch (error) {
      
      if(error.code === 11000) {
        throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);
      }
      console.log(error);
      throw new InternalServerErrorException(`Can't create Pokemon - Check server logs `)

    }
    
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {

    let pokemon : Pokemon;

    // Get whit "no"
    if (!isNaN(+term)){
      pokemon = await this.pokemonModule.findOne({no:term})
    }
    
    // Get whit "MongoId"
    if(isValidObjectId(term)) {
      pokemon = await this.pokemonModule.findById(term);
    }

    //Get whit "name"
    if (!pokemon) {
      pokemon = await this.pokemonModule.findOne({name: term.toLowerCase().trim()})
    }

    //Get not found
    if (!pokemon) throw new NotFoundException(`Pokemon does not exist`)

    return pokemon;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
