import { DataSource, Repository } from 'typeorm';
import { DomainEvent } from '../../domain/events/domainEvent';
import { EventStore } from '../../domain/repositories/eventStore';
import { EventEntity } from '../entities/event.entity';

/**
 * Event store implementation. Also implements EventStore.
 */
export class EventStoreImpl implements EventStore {
  private repository: Repository<EventEntity>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(EventEntity);
  }

  /**
   * Saves an event.
   * @param event Event to save.
   * @throws Error if event is null or undefined.
   */
  async saveEvent<T extends DomainEvent>(event: T): Promise<void> {
    if (!event) {
      throw new Error('Event cannot be null or undefined');
    }

    try {
      const eventEntity = new EventEntity();
      eventEntity.eventName = event.eventName;
      eventEntity.occurredOn = event.occurredOn;

      // Manejo seguro de la serialización
      try {
        eventEntity.data = JSON.stringify(event);
      } catch (error) {
        throw new Error(
          `Failed to serialize event: ${error instanceof Error ? error.message : String(error)}`,
        );
      }

      // Extracción segura del ID de agregado
      if ('user' in event && event.user) {
        const user = event.user as any;
        if (user && user.id) {
          eventEntity.aggregateId = user.id;
        }
      } else if ('userId' in event) {
        const userId = (event as any).userId;
        if (userId) {
          eventEntity.aggregateId = userId;
        }
      }

      await this.repository.save(eventEntity);
    } catch (error) {
      console.error('Failed to save event:', error);
      throw new Error(
        `Failed to save event: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Get events from BD.
   * @param aggregateId Aggregate id.
   * @returns List of events.
   */
  async getEvents(aggregateId?: string): Promise<DomainEvent[]> {
    try {
      const query = this.repository.createQueryBuilder('event').orderBy('event.occurredOn', 'ASC');

      if (aggregateId) {
        query.where('event.aggregateId = :aggregateId', { aggregateId });
      }

      const eventEntities = await query.getMany();

      return eventEntities.map((entity) => {
        try {
          const eventData = JSON.parse(entity.data);
          return eventData as DomainEvent;
        } catch (error) {
          console.error(`Failed to parse event data for event ${entity.id}:`, error);
          // Devolver un evento mínimo en caso de error de parsing
          return {
            eventName: entity.eventName,
            occurredOn: entity.occurredOn,
          } as DomainEvent;
        }
      });
    } catch (error) {
      console.error('Failed to get events:', error);
      throw new Error(
        `Failed to get events: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
